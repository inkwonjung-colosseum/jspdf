// jsPDF 코드 생성 유틸리티

/**
 * 파싱된 데이터를 jsPDF 코드로 변환
 * @param {Object} parsedData - 파싱된 PDF 데이터
 * @param {Object} options - 코드 생성 옵션
 * @returns {string} 생성된 jsPDF 코드
 */
export function generateJsPDFCode(parsedData, options = {}) {
  const {
    template = 'function',
    functionName = 'createPickingSlipPDF',
    exportType = 'export',
    includeImports = true
  } = options;

  let code = '';

  // Import 문 추가
  if (includeImports) {
    code += `import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

`;
  }

  // 함수 시작
  if (template === 'function') {
    if (exportType === 'export') {
      code += `export function ${functionName}(data = {}) {
`;
    } else {
      code += `function ${functionName}(data = {}) {
`;
    }
  } else if (template === 'arrow') {
    if (exportType === 'export') {
      code += `export const ${functionName} = (data = {}) => {
`;
    } else {
      code += `const ${functionName} = (data = {}) => {
`;
    }
  }

  // PDF 인스턴스 생성
  code += `  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

`;

  // 기본 폰트 설정
  code += `  // 기본 폰트 설정
  doc.setFont('helvetica');
  doc.setFontSize(12);

`;

  // 제목 추가
  code += `  // 제목
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('${parsedData.title || 'Picking Slip'}', 105, 20, { align: 'center' });

`;

  // 회사 정보 추가
  if (parsedData.companyName || parsedData.companyAddress || parsedData.companyPhone) {
    code += `  // 회사 정보
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
`;

    if (parsedData.companyName) {
      code += `  doc.text('Company:', 20, 35);
  doc.text(data.companyName || '${parsedData.companyName}', 60, 35);
  
`;
    }

    if (parsedData.companyAddress) {
      code += `  doc.text('Address:', 20, 45);
  doc.text(data.companyAddress || '${parsedData.companyAddress}', 60, 45);
  
`;
    }

    if (parsedData.companyPhone) {
      code += `  doc.text('Phone:', 20, 55);
  doc.text(data.companyPhone || '${parsedData.companyPhone}', 60, 55);

`;
    }
  }

  // 주문 정보 추가
  code += `  // 주문 정보
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Information', 20, 75);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
`;

  if (parsedData.orderNumber) {
    code += `  doc.text('Order Number:', 20, 90);
  doc.text(data.orderNumber || '${parsedData.orderNumber}', 60, 90);
  
`;
  }

  if (parsedData.orderDate) {
    code += `  doc.text('Order Date:', 20, 100);
  doc.text(data.orderDate || '${parsedData.orderDate}', 60, 100);
  
`;
  }

  if (parsedData.customerName) {
    code += `  doc.text('Customer Name:', 20, 110);
  doc.text(data.customerName || '${parsedData.customerName}', 60, 110);

`;
  }

  // 상품 테이블 추가
  if (parsedData.items && parsedData.items.length > 0) {
    code += `  // 상품 테이블
  if (data.items && data.items.length > 0) {
    const tableData = [
      ['Product Code', 'Product Name', 'Quantity', 'Location', 'Note']
    ];
    
    data.items.forEach(item => {
      tableData.push([
        item.code || '',
        item.name || '',
        item.quantity || '',
        item.location || '',
        item.note || ''
      ]);
    });

    doc.autoTable({
      startY: 130,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Product Code
        1: { cellWidth: 50 }, // Product Name
        2: { cellWidth: 20 }, // Quantity
        3: { cellWidth: 25 }, // Location
        4: { cellWidth: 30 }  // Note
      }
    });
  }

`;
  } else {
    code += `  // 기본 상품 테이블 (데이터가 없는 경우)
  const defaultItems = [
    ['LF001', 'Sample Product 1', '1', 'A-01-01', 'Note'],
    ['LF002', 'Sample Product 2', '2', 'A-02-03', 'Note']
  ];

  doc.autoTable({
    startY: 130,
    head: [['Product Code', 'Product Name', 'Quantity', 'Location', 'Note']],
    body: data.items || defaultItems,
    theme: 'grid',
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 50 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 }
    }
  });

`;
  }

  // 담당자 정보 추가
  code += `  // 담당자 정보
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 180;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
`;

  if (parsedData.picker) {
    code += `  doc.text('Picker:', 20, finalY);
  doc.text(data.picker || '${parsedData.picker}', 60, finalY);
  
`;
  }

  if (parsedData.inspector) {
    code += `  doc.text('Inspector:', 20, finalY + 10);
  doc.text(data.inspector || '${parsedData.inspector}', 60, finalY + 10);
  
`;
  }

  if (parsedData.shipmentTime) {
    code += `  doc.text('Shipment Time:', 20, finalY + 20);
  doc.text(data.shipmentTime || '${parsedData.shipmentTime}', 60, finalY + 20);

`;
  }

  // 함수 종료
  code += `  return doc;
`;

  if (template === 'function' || template === 'arrow') {
    code += `}`;
  }

  // 사용 예시 추가
  code += `

// 사용 예시:
// const doc = ${functionName}({
//   companyName: '${parsedData.companyName || 'Your Company'}',
//   companyAddress: '${parsedData.companyAddress || 'Your Address'}',
//   companyPhone: '${parsedData.companyPhone || 'Your Phone'}',
//   orderNumber: '${parsedData.orderNumber || 'ORD-12345'}',
//   customerName: '${parsedData.customerName || 'Customer Name'}',
//   items: [
//     { code: 'ITEM001', name: 'Product 1', quantity: '1', location: 'A-01', note: 'Note' }
//   ],
//   picker: '${parsedData.picker || 'Picker Name'}',
//   inspector: '${parsedData.inspector || 'Inspector Name'}',
//   shipmentTime: '${parsedData.shipmentTime || new Date().toLocaleString()}'
// });
// doc.save('picking-slip.pdf');`;

  return code;
}

/**
 * 다른 템플릿들을 위한 코드 생성 함수들
 */
export function generateInvoiceCode(parsedData, options = {}) {
  // 송장 코드 생성 (추후 구현)
  return "// Invoice template code generation coming soon...";
}

export function generateReceiptCode(parsedData, options = {}) {
  // 영수증 코드 생성 (추후 구현)
  return "// Receipt template code generation coming soon...";
}

/**
 * 코드 생성 옵션들
 */
export const CODE_TEMPLATES = {
  function: 'function',
  arrow: 'arrow',
  class: 'class'
};

export const EXPORT_TYPES = {
  export: 'export',
  default: 'default',
  none: 'none'
};