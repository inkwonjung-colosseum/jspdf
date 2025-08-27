// 비주얼 템플릿 에디터에서 jsPDF 코드를 생성하는 유틸리티

/**
 * 비주얼 요소들을 jsPDF 코드로 변환
 * @param {Array} elements - 캔버스의 요소들
 * @param {Object} options - 코드 생성 옵션
 * @returns {string} 생성된 jsPDF 코드
 */
export function generateVisualTemplateCode(elements, options = {}) {
  const {
    functionName = 'createVisualTemplate',
    exportType = 'export',
    includeImports = true
  } = options;

  if (!elements || elements.length === 0) {
    return "// 요소를 추가하면 여기에 jsPDF 코드가 생성됩니다";
  }

  let code = '';

  // Import 문 추가
  if (includeImports) {
    const needsQRCode = elements.some(el => el.type === 'qrcode');
    const needsBarcode = elements.some(el => el.type === 'barcode');
    const needsAutoTable = elements.some(el => el.type === 'table');
    
    code += `import { jsPDF } from 'jspdf';\n`;
    
    if (needsQRCode) {
      code += `import QRCode from 'qrcode';\n`;
    }
    
    if (needsBarcode) {
      code += `import JsBarcode from 'jsbarcode';\n`;
    }
    
    if (needsAutoTable) {
      code += `import 'jspdf-autotable';\n`;
    }
    
    code += `\n`;
  }

  // 함수 시작
  if (exportType === 'export') {
    code += `export async function ${functionName}(data = {}) {\n`;
  } else {
    code += `async function ${functionName}(data = {}) {\n`;
  }

  // PDF 인스턴스 생성
  code += `  const doc = new jsPDF({\n`;
  code += `    orientation: 'portrait',\n`;
  code += `    unit: 'mm',\n`;
  code += `    format: 'a4'\n`;
  code += `  });\n\n`;

  // 기본 폰트 설정
  code += `  // 기본 폰트 설정\n`;
  code += `  doc.setFont('helvetica');\n\n`;

  // 각 요소별 코드 생성
  elements.forEach((element, index) => {
    code += `  // 요소 ${index + 1}: ${element.type}\n`;
    
    switch (element.type) {
      case 'text':
        code += generateTextCode(element);
        break;
      case 'qrcode':
        code += generateQRCodeCode(element);
        break;
      case 'barcode':
        code += generateBarcodeCode(element);
        break;
      case 'image':
        code += generateImageCode(element);
        break;
      case 'table':
        code += generateTableCode(element);
        break;
    }
    
    code += `\n`;
  });

  // 함수 종료
  code += `  return doc;\n`;
  code += `}\n\n`;

  // 사용 예시
  code += generateUsageExample(functionName, elements);

  return code;
}

/**
 * 텍스트 요소 코드 생성
 */
function generateTextCode(element) {
  let code = '';
  
  // 폰트 설정
  code += `  doc.setFontSize(${element.fontSize});\n`;
  code += `  doc.setFont('helvetica', '${element.fontWeight}');\n`;
  
  if (element.color && element.color !== '#000000') {
    const rgb = hexToRgb(element.color);
    code += `  doc.setTextColor(${rgb.r}, ${rgb.g}, ${rgb.b});\n`;
  }
  
  // 텍스트 출력
  const content = element.content || '텍스트';
  const x = Math.round(element.x * 0.5); // 캔버스 좌표를 mm로 변환
  const y = Math.round(element.y * 0.5);
  
  code += `  doc.text(data.text${getElementIndex(element)} || '${content}', ${x}, ${y});\n`;
  
  return code;
}

/**
 * QR코드 요소 코드 생성
 */
function generateQRCodeCode(element) {
  let code = '';
  
  const content = element.content || 'https://example.com';
  const x = Math.round(element.x * 0.5);
  const y = Math.round(element.y * 0.5);
  const size = Math.round(element.size * 0.5);
  
  code += `  try {\n`;
  code += `    const qrDataUrl = await QRCode.toDataURL(data.qrData${getElementIndex(element)} || '${content}', {\n`;
  code += `      width: ${element.size * 2},\n`;
  code += `      margin: 1,\n`;
  code += `    });\n`;
  code += `    doc.addImage(qrDataUrl, 'PNG', ${x}, ${y}, ${size}, ${size});\n`;
  code += `  } catch (error) {\n`;
  code += `    console.error('QR 코드 생성 실패:', error);\n`;
  code += `    // 대체 텍스트 표시\n`;
  code += `    doc.text('QR 코드', ${x}, ${y + 10});\n`;
  code += `  }\n`;
  
  return code;
}

/**
 * 바코드 요소 코드 생성
 */
function generateBarcodeCode(element) {
  let code = '';
  
  const content = element.content || '1234567890';
  const x = Math.round(element.x * 0.5);
  const y = Math.round(element.y * 0.5);
  const width = Math.round(element.width * 0.5);
  const height = Math.round(element.height * 0.5);
  const format = element.format || 'CODE128';
  
  code += `  try {\n`;
  code += `    const canvas = document.createElement('canvas');\n`;
  code += `    JsBarcode(canvas, data.barcodeData${getElementIndex(element)} || '${content}', {\n`;
  code += `      format: '${format}',\n`;
  code += `      width: 2,\n`;
  code += `      height: 100,\n`;
  code += `      displayValue: true\n`;
  code += `    });\n`;
  code += `    const barcodeDataUrl = canvas.toDataURL();\n`;
  code += `    doc.addImage(barcodeDataUrl, 'PNG', ${x}, ${y}, ${width}, ${height});\n`;
  code += `  } catch (error) {\n`;
  code += `    console.error('바코드 생성 실패:', error);\n`;
  code += `    // 대체 사각형 그리기\n`;
  code += `    doc.rect(${x}, ${y}, ${width}, ${height});\n`;
  code += `    doc.text('바코드', ${x + 5}, ${y + 10});\n`;
  code += `  }\n`;
  
  return code;
}

/**
 * 이미지 요소 코드 생성
 */
function generateImageCode(element) {
  let code = '';
  
  const x = Math.round(element.x * 0.5);
  const y = Math.round(element.y * 0.5);
  const width = Math.round(element.width * 0.5);
  const height = Math.round(element.height * 0.5);
  
  code += `  try {\n`;
  if (element.src) {
    code += `    // 이미지 URL: ${element.src}\n`;
    code += `    const imageUrl = data.imageUrl${getElementIndex(element)} || '${element.src}';\n`;
  } else {
    code += `    const imageUrl = data.imageUrl${getElementIndex(element)} || 'data:image/png;base64,iVBORw0KGgo...';\n`;
  }
  code += `    doc.addImage(imageUrl, 'JPEG', ${x}, ${y}, ${width}, ${height});\n`;
  code += `  } catch (error) {\n`;
  code += `    console.error('이미지 추가 실패:', error);\n`;
  code += `    // 대체 사각형 그리기\n`;
  code += `    doc.rect(${x}, ${y}, ${width}, ${height});\n`;
  code += `    doc.text('이미지', ${x + 5}, ${y + 10});\n`;
  code += `  }\n`;
  
  return code;
}

/**
 * 테이블 요소 코드 생성
 */
function generateTableCode(element) {
  let code = '';
  
  const x = Math.round(element.x * 0.5);
  const y = Math.round(element.y * 0.5);
  
  // 기본 테이블 데이터
  const headers = element.headers || ['Header 1', 'Header 2', 'Header 3'];
  const data = element.data || [
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
  ];
  
  code += `  const tableData${getElementIndex(element)} = data.tableData${getElementIndex(element)} || [\n`;
  data.forEach((row, index) => {
    code += `    ['${row.join("', '")}']${index === data.length - 1 ? '' : ','}\n`;
  });
  code += `  ];\n\n`;
  
  code += `  doc.autoTable({\n`;
  code += `    startY: ${y},\n`;
  code += `    head: [['${headers.join("', '")}']],\n`;
  code += `    body: tableData${getElementIndex(element)},\n`;
  code += `    theme: 'grid',\n`;
  code += `    headStyles: {\n`;
  code += `      fillColor: [41, 128, 185],\n`;
  code += `      textColor: [255, 255, 255],\n`;
  code += `      fontStyle: 'bold'\n`;
  code += `    },\n`;
  code += `    styles: {\n`;
  code += `      fontSize: 10,\n`;
  code += `      cellPadding: 3\n`;
  code += `    }\n`;
  code += `  });\n`;
  
  return code;
}

/**
 * 사용 예시 생성
 */
function generateUsageExample(functionName, elements) {
  let code = `// 사용 예시:\n`;
  code += `// const doc = await ${functionName}({\n`;
  
  elements.forEach((element, index) => {
    switch (element.type) {
      case 'text':
        code += `//   text${getElementIndex(element)}: '${element.content || '사용자 텍스트'}',\n`;
        break;
      case 'qrcode':
        code += `//   qrData${getElementIndex(element)}: '${element.content || 'https://example.com'}',\n`;
        break;
      case 'barcode':
        code += `//   barcodeData${getElementIndex(element)}: '${element.content || '1234567890'}',\n`;
        break;
      case 'image':
        code += `//   imageUrl${getElementIndex(element)}: '${element.src || 'https://example.com/image.jpg'}',\n`;
        break;
      case 'table':
        code += `//   tableData${getElementIndex(element)}: [\n`;
        code += `//     ['데이터1', '데이터2', '데이터3'],\n`;
        code += `//     ['데이터4', '데이터5', '데이터6']\n`;
        code += `//   ],\n`;
        break;
    }
  });
  
  code += `// });\n`;
  code += `// doc.save('visual-template.pdf');`;
  
  return code;
}

/**
 * 유틸리티 함수들
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function getElementIndex(element) {
  // 요소의 고유 식별자를 위한 간단한 해시
  return String(element.id).slice(-3);
}