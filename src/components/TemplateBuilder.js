import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { 
  PlusIcon,
  CursorArrowRaysIcon,
  PhotoIcon,
  QrCodeIcon,
  Bars3BottomLeftIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  RectangleStackIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import CodeEditor from "./CodeEditor";
import { generateVisualTemplateCode } from "../utils/visualCodeGenerator";

export default function TemplateBuilder() {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [generatedCode, setGeneratedCode] = useState("");
  const [showGrid, setShowGrid] = useState(true);

  // A4 용지 비율 (210 × 297 mm = 약 1:1.414)
  const canvasSize = { width: 420, height: 594 }; // 2배 스케일

  // 요소 타입별 기본값
  const elementDefaults = {
    text: {
      type: 'text',
      content: '텍스트',
      x: 20,
      y: 30,
      fontSize: 12,
      fontWeight: 'normal',
      color: '#000000',
      width: 100,
      height: 20
    },
    qrcode: {
      type: 'qrcode',
      content: 'https://example.com',
      x: 20,
      y: 50,
      size: 50,
      width: 50,
      height: 50
    },
    barcode: {
      type: 'barcode',
      content: '1234567890',
      x: 20,
      y: 120,
      width: 100,
      height: 30,
      format: 'CODE128' // CODE128, CODE39, EAN13, EAN8, UPC 등
    },
    image: {
      type: 'image',
      src: '',
      x: 20,
      y: 100,
      width: 80,
      height: 60
    },
    table: {
      type: 'table',
      x: 20,
      y: 150,
      width: 160,
      height: 80,
      rows: 3,
      cols: 3,
      headers: ['Header 1', 'Header 2', 'Header 3'],
      data: [
        ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
        ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
      ]
    }
  };

  // 요소 추가
  const addElement = useCallback((type) => {
    const newElement = {
      id: Date.now() + Math.random(),
      ...elementDefaults[type]
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    generateCode([...elements, newElement]);
  }, [elements]);

  // 요소 삭제
  const deleteElement = useCallback((elementId) => {
    const newElements = elements.filter(el => el.id !== elementId);
    setElements(newElements);
    setSelectedElement(null);
    generateCode(newElements);
  }, [elements]);

  // 요소 선택
  const selectElement = useCallback((elementId) => {
    setSelectedElement(elementId);
  }, []);

  // 요소 속성 업데이트
  const updateElement = useCallback((elementId, updates) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    setElements(newElements);
    generateCode(newElements);
  }, [elements]);

  // 드래그 시작
  const handleMouseDown = useCallback((e, elementId) => {
    if (e.target.closest('.element-controls')) return; // 컨트롤 버튼 클릭시 드래그 방지
    
    setSelectedElement(elementId);
    setIsDragging(true);
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const element = elements.find(el => el.id === elementId);
    
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  }, [elements]);

  // 드래그 중
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !selectedElement) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(canvasSize.width - 50, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(0, Math.min(canvasSize.height - 50, e.clientY - rect.top - dragOffset.y));
    
    updateElement(selectedElement, { x: newX, y: newY });
  }, [isDragging, selectedElement, dragOffset, updateElement, canvasSize]);

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 코드 생성
  const generateCode = useCallback((elementsToProcess = elements) => {
    if (elementsToProcess.length === 0) {
      setGeneratedCode("");
      return;
    }

    const code = generateVisualTemplateCode(elementsToProcess);
    setGeneratedCode(code);
  }, [elements]);

  // QR코드 렌더링 (미리보기용)
  const renderQRPreview = useCallback(async (element) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(element.content, {
        width: element.size * 2, // 고해상도
        margin: 1,
      });
      return qrDataUrl;
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
      return null;
    }
  }, []);

  // 바코드 렌더링 (미리보기용)
  const renderBarcodePreview = useCallback((element) => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, element.content, {
        format: element.format || 'CODE128',
        width: 2,
        height: 100,
        displayValue: false
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('바코드 생성 실패:', error);
      return null;
    }
  }, []);

  // PDF 미리보기 생성
  const generatePDFPreview = useCallback(async () => {
    if (elements.length === 0) {
      alert('요소를 추가한 후 미리보기를 생성하세요.');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 각 요소별로 PDF에 추가
      for (const element of elements) {
        const x = element.x * 0.5;
        const y = element.y * 0.5;

        switch (element.type) {
          case 'text':
            doc.setFontSize(element.fontSize);
            doc.setFont('helvetica', element.fontWeight);
            if (element.color && element.color !== '#000000') {
              const rgb = hexToRgb(element.color);
              doc.setTextColor(rgb.r, rgb.g, rgb.b);
            }
            doc.text(element.content, x, y);
            break;

          case 'qrcode':
            try {
              const qrDataUrl = await QRCode.toDataURL(element.content, {
                width: element.size * 2,
                margin: 1,
              });
              doc.addImage(qrDataUrl, 'PNG', x, y, element.size * 0.5, element.size * 0.5);
            } catch (error) {
              console.error('QR 코드 생성 실패:', error);
            }
            break;

          case 'barcode':
            try {
              const canvas = document.createElement('canvas');
              JsBarcode(canvas, element.content, {
                format: element.format || 'CODE128',
                width: 2,
                height: 100,
              });
              const barcodeDataUrl = canvas.toDataURL();
              doc.addImage(barcodeDataUrl, 'PNG', x, y, element.width * 0.5, element.height * 0.5);
            } catch (error) {
              console.error('바코드 생성 실패:', error);
            }
            break;

          case 'image':
            if (element.src) {
              try {
                doc.addImage(element.src, 'JPEG', x, y, element.width * 0.5, element.height * 0.5);
              } catch (error) {
                console.error('이미지 추가 실패:', error);
              }
            }
            break;

          case 'table':
            // 간단한 테이블 구현 (jspdf-autotable 없이)
            const cellWidth = (element.width * 0.5) / 3;
            const cellHeight = (element.height * 0.5) / 3;
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                doc.rect(x + col * cellWidth, y + row * cellHeight, cellWidth, cellHeight);
                doc.text(`${row === 0 ? 'H' : 'R'}${row === 0 ? col + 1 : row}${row === 0 ? '' : 'C' + (col + 1)}`, 
                  x + col * cellWidth + 2, y + row * cellHeight + 5);
              }
            }
            break;
        }
      }

      // PDF를 새창에서 열기
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // 메모리 정리
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);

    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  }, [elements]);

  // 색상 헥스를 RGB로 변환
  const hexToRgb = useCallback((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 왼쪽: 요소 팔레트 */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          요소 추가
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={() => addElement('text')}
            className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <Bars3BottomLeftIcon className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-blue-800">텍스트</span>
          </button>

          <button
            onClick={() => addElement('qrcode')}
            className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <QrCodeIcon className="h-5 w-5 mr-3 text-green-600" />
            <span className="font-medium text-green-800">QR 코드</span>
          </button>

          <button
            onClick={() => addElement('barcode')}
            className="w-full p-3 text-left bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <RectangleStackIcon className="h-5 w-5 mr-3 text-yellow-600" />
            <span className="font-medium text-yellow-800">바코드</span>
          </button>

          <button
            onClick={() => addElement('image')}
            className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <PhotoIcon className="h-5 w-5 mr-3 text-purple-600" />
            <span className="font-medium text-purple-800">이미지</span>
          </button>

          <button
            onClick={() => addElement('table')}
            className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <TableCellsIcon className="h-5 w-5 mr-3 text-orange-600" />
            <span className="font-medium text-orange-800">테이블</span>
          </button>
        </div>

        {/* 속성 편집 패널 */}
        {selectedElement && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-4">속성 편집</h3>
            <ElementProperties
              element={elements.find(el => el.id === selectedElement)}
              onUpdate={(updates) => updateElement(selectedElement, updates)}
              onDelete={() => deleteElement(selectedElement)}
            />
          </div>
        )}
      </div>

      {/* 가운데: 캔버스 */}
      <div className="flex-1 flex flex-col">
        {/* 툴바 */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              ← 텍스트 에디터로 돌아가기
            </a>
            <h1 className="text-xl font-semibold text-gray-900">📄 비주얼 템플릿 에디터</h1>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                showGrid ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              그리드 {showGrid ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={generatePDFPreview}
              disabled={elements.length === 0}
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                elements.length > 0
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              PDF 미리보기
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {elements.length}개 요소
          </div>
        </div>

        {/* 캔버스 영역 */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-gray-100">
          <div 
            ref={canvasRef}
            className="relative bg-white shadow-lg border border-gray-300"
            style={{ 
              width: canvasSize.width, 
              height: canvasSize.height,
              backgroundImage: showGrid ? `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              ` : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'none'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* 요소들 렌더링 */}
            {elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={() => selectElement(element.id)}
                onDelete={() => deleteElement(element.id)}
                renderQRPreview={renderQRPreview}
                renderBarcodePreview={renderBarcodePreview}
              />
            ))}
            
            {/* 빈 캔버스 안내 */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <CursorArrowRaysIcon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">왼쪽에서 요소를 추가하세요</p>
                  <p className="text-sm">드래그 앤 드롭으로 위치를 조정할 수 있습니다</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽: 코드 에디터 */}
      <div className="w-96 bg-white border-l border-gray-200">
        <CodeEditor 
          code={generatedCode}
          title="비주얼 템플릿 코드"
        />
      </div>
    </div>
  );
}

// 캔버스 요소 컴포넌트
function CanvasElement({ element, isSelected, onMouseDown, onClick, onDelete, renderQRPreview, renderBarcodePreview }) {
  const [qrPreview, setQrPreview] = useState(null);
  const [barcodePreview, setBarcodePreview] = useState(null);

  // QR코드 미리보기 생성
  React.useEffect(() => {
    if (element.type === 'qrcode') {
      renderQRPreview(element).then(setQrPreview);
    }
  }, [element, renderQRPreview]);

  // 바코드 미리보기 생성
  React.useEffect(() => {
    if (element.type === 'barcode') {
      setBarcodePreview(renderBarcodePreview(element));
    }
  }, [element, renderBarcodePreview]);

  const elementStyle = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    cursor: 'move',
    border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
    borderRadius: '2px',
  };

  return (
    <div
      style={elementStyle}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`group ${isSelected ? 'ring-2 ring-blue-300' : ''}`}
    >
      {/* 요소별 렌더링 */}
      {element.type === 'text' && (
        <div
          className="w-full h-full flex items-center px-2"
          style={{
            fontSize: `${element.fontSize * 0.75}px`, // 캔버스에서는 작게 표시
            fontWeight: element.fontWeight,
            color: element.color,
            backgroundColor: 'rgba(255,255,255,0.8)'
          }}
        >
          {element.content}
        </div>
      )}

      {element.type === 'qrcode' && (
        <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center">
          {qrPreview ? (
            <img src={qrPreview} alt="QR Preview" className="w-full h-full object-contain" />
          ) : (
            <QrCodeIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
      )}

      {element.type === 'barcode' && (
        <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center">
          {barcodePreview ? (
            <img src={barcodePreview} alt="Barcode Preview" className="w-full h-full object-contain" />
          ) : (
            <RectangleStackIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
      )}

      {element.type === 'image' && (
        <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center">
          {element.src ? (
            <img src={element.src} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <PhotoIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
      )}

      {element.type === 'table' && (
        <div className="w-full h-full bg-white border border-gray-300 text-xs">
          <div className="grid grid-cols-3 h-full">
            {Array(9).fill().map((_, i) => (
              <div key={i} className="border-r border-b border-gray-200 p-1 text-center">
                {i < 3 ? `H${i+1}` : `R${Math.floor(i/3)}C${(i%3)+1}`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 선택시 컨트롤 */}
      {isSelected && (
        <div className="element-controls absolute -top-8 -right-2 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// 속성 편집 패널 컴포넌트
function ElementProperties({ element, onUpdate, onDelete }) {
  if (!element) return null;

  return (
    <div className="space-y-3">
      {/* 공통 속성 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          위치 X
        </label>
        <input
          type="number"
          value={element.x}
          onChange={(e) => onUpdate({ x: Number(e.target.value) })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          위치 Y
        </label>
        <input
          type="number"
          value={element.y}
          onChange={(e) => onUpdate({ y: Number(e.target.value) })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 요소별 특정 속성 */}
      {element.type === 'text' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <input
              type="text"
              value={element.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              폰트 크기
            </label>
            <input
              type="number"
              value={element.fontSize}
              onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              폰트 굵기
            </label>
            <select
              value={element.fontWeight}
              onChange={(e) => onUpdate({ fontWeight: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">보통</option>
              <option value="bold">굵게</option>
            </select>
          </div>
        </>
      )}

      {element.type === 'qrcode' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              QR 데이터
            </label>
            <textarea
              value={element.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows="3"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL 또는 텍스트 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              크기
            </label>
            <input
              type="number"
              value={element.size}
              onChange={(e) => {
                const size = Number(e.target.value);
                onUpdate({ size, width: size, height: size });
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {element.type === 'barcode' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              바코드 데이터
            </label>
            <input
              type="text"
              value={element.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="바코드 번호 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              바코드 타입
            </label>
            <select
              value={element.format || 'CODE128'}
              onChange={(e) => onUpdate({ format: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CODE128">CODE128</option>
              <option value="CODE39">CODE39</option>
              <option value="EAN13">EAN13</option>
              <option value="EAN8">EAN8</option>
              <option value="UPC">UPC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              너비
            </label>
            <input
              type="number"
              value={element.width}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              높이
            </label>
            <input
              type="number"
              value={element.height}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {element.type === 'image' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL
            </label>
            <input
              type="url"
              value={element.src}
              onChange={(e) => onUpdate({ src: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              너비
            </label>
            <input
              type="number"
              value={element.width}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              높이
            </label>
            <input
              type="number"
              value={element.height}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {/* 삭제 버튼 */}
      <button
        onClick={onDelete}
        className="w-full mt-4 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        요소 삭제
      </button>
    </div>
  );
}