import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DocumentTextIcon, 
  CogIcon, 
  DocumentDuplicateIcon,
  EyeIcon,
  ArrowDownOnSquareIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import CodeEditor from "./CodeEditor";
import { generateJsPDFCode } from "../utils/codeGenerator";

export default function PDFPreviewPage() {
  const [selectedPdfType, setSelectedPdfType] = useState("pickingSlip");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeOptions, setCodeOptions] = useState({
    template: 'function',
    functionName: 'createPickingSlipPDF',
    exportType: 'export',
    includeImports: true
  });

  // PDF 타입별 기본 텍스트 내용 
  const getDefaultTextContent = (type) => {
    switch (type) {
      case "pickingSlip":
        return `Company: Line Friends Co., Ltd.
Address: 123 Teheran-ro, Gangnam-gu, Seoul, South Korea
Phone: +82-2-1234-5678

Order Number: ORD-${Date.now()}
Order Date: ${new Date().toLocaleDateString('en-US')}
Customer Name: John Smith

Product List:
- Product Code: LF001, Product Name: Brown Bear (Large), Quantity: 2, Location: A-01-01, Note: Selected
- Product Code: LF002, Product Name: Cony Rabbit (Medium), Quantity: 1, Location: A-02-03, Note: Selected
- Product Code: LF003, Product Name: Sally Chicken (Small), Quantity: 3, Location: B-01-02, Note: Pending

Picker: Kim Picker
Inspector: Lee Inspector
Shipment Time: ${new Date().toLocaleString('en-US')}`;

      default:
        return "";
    }
  };

  // 텍스트를 파싱하여 PDF 생성에 필요한 데이터로 변환
  const parseTextToData = (text) => {
    const lines = text.split('\n');
    const data = {};
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('-')) return;
      
      if (trimmedLine.includes(':')) {
        const [key, value] = trimmedLine.split(':').map(s => s.trim());
        
        switch (key) {
          case 'Company':
            data.companyName = value;
            break;
          case 'Address':
            data.companyAddress = value;
            break;
          case 'Phone':
            data.companyPhone = value;
            break;
          case 'Order Number':
            data.orderNumber = value;
            break;
          case 'Customer Name':
            data.customerName = value;
            break;
          case 'Picker':
            data.picker = value;
            break;
          case 'Inspector':
            data.inspector = value;
            break;
        }
      }
    });
    
    // 상품 목록 파싱
    const itemLines = lines.filter(line => line.trim().startsWith('-') && line.includes('Product Name:'));
    if (itemLines.length > 0) {
      data.items = itemLines.map(itemLine => {
        const itemData = {};
        const parts = itemLine.split(',').map(part => part.trim());
        
        parts.forEach(part => {
          if (part.includes(':')) {
            const [key, value] = part.split(':').map(s => s.trim());
            switch (key) {
              case 'Product Code':
                itemData.code = value;
                break;
              case 'Product Name':
                itemData.name = value;
                break;
              case 'Quantity':
                itemData.quantity = value;
                break;
              case 'Location':
                itemData.location = value;
                break;
              case 'Note':
                itemData.note = value;
                break;
            }
          }
        });
        
        return itemData;
      });
    }
    
    return data;
  };

  // PDF 타입 변경 시 기본 텍스트 로드
  const handlePdfTypeChange = (type) => {
    setSelectedPdfType(type);
    setTextContent(getDefaultTextContent(type));
  };

  // PDF 및 코드 생성
  const generatePDF = async () => {
    if (!textContent.trim()) {
      alert('Please enter text content.');
      return;
    }

    setIsGenerating(true);
    try {
      const { createPickingSlipPDF } = await import("../utils/simplePdfGenerator");
      
      const parsedData = parseTextToData(textContent);
      
      // PDF 생성
      const doc = createPickingSlipPDF(parsedData);
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      
      // 기존 URL 정리
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(url);

      // jsPDF 코드 생성
      const jsCode = generateJsPDFCode({
        ...parsedData,
        title: 'Picking Slip'
      }, codeOptions);
      setGeneratedCode(jsCode);

    } catch (error) {
      console.error("PDF generation error:", error);
      alert("An error occurred while generating the PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 코드 옵션 변경 핸들러
  const handleCodeOptionsChange = (newOptions) => {
    setCodeOptions(newOptions);
    // 현재 파싱된 데이터가 있으면 코드를 재생성
    if (textContent.trim()) {
      const parsedData = parseTextToData(textContent);
      const jsCode = generateJsPDFCode({
        ...parsedData,
        title: 'Picking Slip'
      }, newOptions);
      setGeneratedCode(jsCode);
    }
  };

  // 컴포넌트 마운트 시 기본 텍스트 로드
  useEffect(() => {
    setTextContent(getDefaultTextContent(selectedPdfType));
  }, []);

  const pdfTypeOptions = [
    { value: "pickingSlip", label: "📋 Picking Slip", color: "bg-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 헤더 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">jsPDF 코드 생성기</h1>
                <p className="text-sm text-gray-500">PDF를 디자인하고 jsPDF 코드를 자동 생성하여 다른 프로젝트에서 바로 사용</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <a 
                href="/template-builder" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-colors duration-200"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                비주얼 빌더
              </a>
              <a 
                href="/jspdf-guide" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Usage Guide
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 왼쪽 컨트롤 패널 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* PDF 타입 선택 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
                PDF Type Selection
              </h2>
              <div className="space-y-3">
                {pdfTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePdfTypeChange(option.value)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedPdfType === option.value
                        ? `${option.color} border-transparent text-white shadow-lg transform scale-105`
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 텍스트 편집기 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-gray-500" />
                Text Editor
              </h2>
              <textarea
                id="pdf-text-editor"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-48 p-4 rounded-lg border border-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* PDF 생성 버튼 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className={`w-full p-4 rounded-lg text-white border-none text-lg font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isGenerating 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl cursor-pointer'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownOnSquareIcon className="h-5 w-5" />
                    <span>📄 PDF & 코드 생성</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* 사용법 안내 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong className="block mb-2">💡 사용법:</strong>
                <ul className="space-y-1 text-xs">
                  <li>• 텍스트를 편집하여 PDF 내용 수정</li>
                  <li>• Generate PDF 버튼으로 PDF 및 코드 생성</li>
                  <li>• 가운데에서 PDF 미리보기 확인</li>
                  <li>• 오른쪽에서 생성된 jsPDF 코드 복사</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 가운데 PDF 미리보기 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
                PDF Preview
              </h2>
              
              {pdfUrl ? (
                <div className="relative">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[calc(100vh-200px)] border border-gray-300 rounded-lg shadow-inner"
                    title="PDF Preview"
                  />
                  <div className="absolute top-4 right-4">
                    <a
                      href={pdfUrl}
                      download="picking-slip.pdf"
                      className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg"
                    >
                      <ArrowDownOnSquareIcon className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-500"
                >
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-6xl mb-4"
                  >
                    📄
                  </motion.div>
                  <div className="text-xl mb-2 font-medium">Generate a PDF</div>
                  <div className="text-sm text-center max-w-md">
                    Select a PDF type on the left, edit the text, and click the generate button
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* 오른쪽 코드 에디터 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-1"
          >
            <CodeEditor 
              code={generatedCode}
              title="Generated jsPDF Code"
              onOptionsChange={handleCodeOptionsChange}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
