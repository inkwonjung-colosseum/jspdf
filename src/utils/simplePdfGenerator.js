import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// 기본 폰트 설정으로 PDF 생성
export function createPickingSlipPDF(data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // 기본 폰트 설정 (한글 지원)
  doc.setFont('helvetica');
  doc.setFontSize(12);

  // 제목
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Picking Slip', 105, 20, { align: 'center' });

  // 회사 정보
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Company:', 20, 35);
  doc.text(data.companyName || 'Line Friends Co., Ltd.', 60, 35);
  
  doc.text('Address:', 20, 45);
  doc.text(data.companyAddress || '123 Teheran-ro, Gangnam-gu, Seoul, South Korea', 60, 45);
  
  doc.text('Phone:', 20, 55);
  doc.text(data.companyPhone || '+82-2-1234-5678', 60, 55);

  // 주문 정보
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Information', 20, 75);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Order Number:', 20, 90);
  doc.text(data.orderNumber || 'ORD-' + Date.now(), 60, 90);
  
  doc.text('Order Date:', 20, 100);
  doc.text(data.orderDate || new Date().toLocaleDateString('en-US'), 60, 100);
  
  doc.text('Customer Name:', 20, 110);
  doc.text(data.customerName || 'John Smith', 60, 110);

  // 상품 테이블
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

  // 담당자 정보
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 180;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Picker:', 20, finalY);
  doc.text(data.picker || 'Kim Picker', 60, finalY);
  
  doc.text('Inspector:', 20, finalY + 10);
  doc.text(data.inspector || 'Lee Inspector', 60, finalY + 10);
  
  doc.text('Shipment Time:', 20, finalY + 20);
  doc.text(data.shipmentTime || new Date().toLocaleString('en-US'), 60, finalY + 20);

  return doc;
}

// 텍스트 서식 파싱 함수 (마크다운 스타일)
export function parseFormattedText(text) {
  if (typeof text !== 'string') return text;
  
  // 굵게: **text** -> <b>text</b>
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  // 기울임: *text* -> <i>text</i>
  text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');
  
  // 밑줄: __text__ -> <u>text</u>
  text = text.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // 하이라이트: ==text== -> <mark>text</mark>
  text = text.replace(/==(.*?)==/g, '<mark>$1</mark>');
  
  return text;
}

// 서식이 적용된 텍스트 렌더링
export function renderFormattedText(doc, text, x, y, options = {}) {
  if (typeof text !== 'string') return;
  
  const { fontSize = 12, fontStyle = 'normal' } = options;
  
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', fontStyle);
  
  // HTML 태그 제거하고 순수 텍스트만 추출
  const cleanText = text.replace(/<[^>]+>/g, '');
  
  doc.text(cleanText, x, y);
}
