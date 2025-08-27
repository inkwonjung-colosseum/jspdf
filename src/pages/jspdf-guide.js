import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function JSPDFGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            📚 jsPDF & jsPDF-AutoTable 사용법 가이드
          </h1>
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 hover:underline px-4 py-2 border border-blue-600 rounded-lg"
          >
            ← PDF 생성기로 돌아가기
          </a>
        </div>

        {/* 목차 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 목차</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• <a href="#installation" className="text-blue-600 hover:underline">설치 및 설정</a></li>
            <li>• <a href="#basic-usage" className="text-blue-600 hover:underline">기본 사용법</a></li>
            <li>• <a href="#text-formatting" className="text-blue-600 hover:underline">텍스트 서식</a></li>
            <li>• <a href="#shapes-images" className="text-blue-600 hover:underline">도형 및 이미지</a></li>
            <li>• <a href="#autotable-basic" className="text-blue-600 hover:underline">AutoTable 기본</a></li>
            <li>• <a href="#autotable-styling" className="text-blue-600 hover:underline">AutoTable 스타일링</a></li>
            <li>• <a href="#autotable-hooks" className="text-blue-600 hover:underline">AutoTable 훅</a></li>
            <li>• <a href="#fonts-multilingual" className="text-blue-600 hover:underline">폰트 및 다국어 지원</a></li>
            <li>• <a href="#examples" className="text-blue-600 hover:underline">실제 예제</a></li>
          </ul>
        </div>

        {/* 설치 및 설정 */}
        <div id="installation" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 설치 및 설정</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">npm 설치</h3>
            <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
              npm install jspdf jspdf-autotable
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">ES6 모듈 임포트</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg">
              {`import { jsPDF } from 'jspdf';
import 'jspdf-autotable';`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">CDN 사용</h3>
            <SyntaxHighlighter language="html" style={tomorrow} className="rounded-lg">
              {`<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js"></script>`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 기본 사용법 */}
        <div id="basic-usage" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📄 기본 사용법</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">기본 PDF 생성</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`import { jsPDF } from 'jspdf';

const doc = new jsPDF();
doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");`}
            </SyntaxHighlighter>
            <p className="text-gray-600 text-sm">
              • jsPDF 인스턴스 생성<br/>
              • text() 메서드로 텍스트 추가 (x, y 좌표)<br/>
              • save() 메서드로 PDF 저장
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">페이지 추가</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

// 첫 번째 페이지
doc.text("Page 1", 10, 10);

// 새 페이지 추가
doc.addPage();

// 두 번째 페이지
doc.text("Page 2", 10, 10);

doc.save("multi-page.pdf");`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">PDF 옵션 설정</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF({
  orientation: 'landscape',  // 가로 방향
  unit: 'mm',               // 단위 (pt, mm, cm, in)
  format: 'a4'              // 용지 크기
});`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 텍스트 서식 */}
        <div id="text-formatting" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">✏️ 텍스트 서식</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">폰트 설정</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

// 폰트 패밀리 설정
doc.setFont('helvetica');        // 기본
doc.setFont('times');            // Times New Roman
doc.setFont('courier');          // Courier

// 폰트 스타일 설정
doc.setFont('helvetica', 'bold');        // 굵게
doc.setFont('helvetica', 'italic');      // 기울임
doc.setFont('helvetica', 'bolditalic');  // 굵은 기울임

// 폰트 크기 설정
doc.setFontSize(12);             // 12pt
doc.setFontSize(20);             // 20pt`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">텍스트 색상</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

// RGB 색상 설정
doc.setTextColor(255, 0, 0);     // 빨간색
doc.setTextColor(0, 255, 0);     // 초록색
doc.setTextColor(0, 0, 255);     // 파란색

// 그레이스케일
doc.setTextColor(100);            // 회색 (0-255)

// 텍스트 추가
doc.text("Colored text", 10, 20);`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">텍스트 정렬</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

// 왼쪽 정렬 (기본값)
doc.text("Left aligned", 10, 20);

// 가운데 정렬
doc.text("Center aligned", 105, 30, { align: 'center' });

// 오른쪽 정렬
doc.text("Right aligned", 200, 40, { align: 'right' });

// 여러 줄 텍스트
doc.text("Line 1\\nLine 2\\nLine 3", 10, 50);`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 도형 및 이미지 */}
        <div id="shapes-images" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔷 도형 및 이미지</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">도형 그리기</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

// 선 그리기
doc.setDrawColor(255, 0, 0);     // 빨간색
doc.setLineWidth(2);              // 선 두께
doc.line(10, 10, 100, 100);      // x1, y1, x2, y2

// 사각형 그리기
doc.setDrawColor(0, 0, 255);     // 파란색 테두리
doc.setFillColor(255, 255, 0);   // 노란색 채우기
doc.rect(20, 20, 50, 30, 'FD'); // x, y, width, height, style
// style: 'S'(테두리만), 'F'(채우기만), 'FD'(테두리+채우기)

// 원 그리기
doc.circle(100, 100, 20, 'FD'); // x, y, radius, style`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">이미지 추가</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

// Base64 이미지 추가
const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...';
doc.addImage(base64Image, 'JPEG', 10, 10, 50, 50);

// URL 이미지 추가
doc.addImage('https://example.com/image.png', 'PNG', 70, 10, 50, 50);

// HTML Canvas 이미지 추가
const canvas = document.getElementById('myCanvas');
doc.addImage(canvas, 'PNG', 130, 10, 50, 50);`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* AutoTable 기본 */}
        <div id="autotable-basic" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 AutoTable 기본</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">기본 테이블 생성</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const doc = new jsPDF();

// 간단한 테이블
doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain'],
    ['John', 'john@example.com', 'USA']
  ]
});

doc.save('table.pdf');`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">HTML 테이블에서 생성</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`// HTML 테이블이 있다고 가정
// <table id="my-table">...</table>

const doc = new jsPDF();
doc.autoTable({ html: '#my-table' });
doc.save('html-table.pdf');`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">객체 배열 사용</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

const data = [
  { name: 'David', email: 'david@example.com', country: 'Sweden' },
  { name: 'Castille', email: 'castille@example.com', country: 'Spain' }
];

doc.autoTable({
  columns: [
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Country', dataKey: 'country' }
  ],
  body: data
});

doc.save('object-table.pdf');`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* AutoTable 스타일링 */}
        <div id="autotable-styling" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎨 AutoTable 스타일링</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">테마 및 기본 스타일</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain']
  ],
  theme: 'striped',        // 'striped', 'grid', 'plain'
  styles: {
    fontSize: 12,
    cellPadding: 5,
    lineColor: [0, 0, 0],
    lineWidth: 0.1
  }
});`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">헤더/바디별 스타일</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain']
  ],
  headStyles: {
    fillColor: [41, 128, 185],    // 파란색 배경
    textColor: [255, 255, 255],   // 흰색 텍스트
    fontSize: 14,
    fontStyle: 'bold'
  },
  bodyStyles: {
    fontSize: 10,
    textColor: [50, 50, 50]
  },
  alternateRowStyles: {
    fillColor: [245, 245, 245]    // 격줄 배경색
  }
});`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">컬럼별 스타일</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain']
  ],
  columnStyles: {
    0: {                    // 첫 번째 컬럼 (Name)
      halign: 'left',
      fillColor: [255, 255, 0],  // 노란색 배경
      fontStyle: 'bold'
    },
    1: {                    // 두 번째 컬럼 (Email)
      halign: 'center',
      fillColor: [0, 255, 0]     // 초록색 배경
    },
    2: {                    // 세 번째 컬럼 (Country)
      halign: 'right',
      fillColor: [255, 0, 0]     // 빨간색 배경
    }
  }
});`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* AutoTable 훅 */}
        <div id="autotable-hooks" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔗 AutoTable 훅</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">셀 그리기 후 훅</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain']
  ],
  didDrawCell: function(data) {
    // 첫 번째 컬럼에 이미지 추가
    if (data.section === 'body' && data.column.index === 0) {
      const base64Img = 'data:image/jpeg;base64,iVBORw0KGgoAAAANS...';
      doc.addImage(base64Img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10);
    }
  }
});`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">셀 파싱 후 훅</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain']
  ],
  didParseCell: function(data) {
    // HTML 태그 제거
    if (data.cell && data.cell.text && typeof data.cell.text === 'string') {
      data.cell.text = data.cell.text.replace(/<[^>]+>/g, '');
    }
    
    // 특정 컬럼의 텍스트 변환
    if (data.column.index === 2) { // Country 컬럼
      data.cell.text = data.cell.text.toUpperCase();
    }
  }
});`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">페이지 그리기 훅</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`const doc = new jsPDF();

doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain']
  ],
  willDrawPage: function(data) {
    // 페이지 그리기 전에 헤더 추가
    doc.setFontSize(20);
    doc.text('Employee List', 20, 20);
  },
  didDrawPage: function(data) {
    // 페이지 그리기 후에 푸터 추가
    doc.setFontSize(10);
    doc.text(\`Page \${data.pageNumber}\`, 20, doc.internal.pageSize.height - 10);
  }
});`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 실제 예제 */}
        <div id="examples" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">💡 실제 예제</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">영수증 생성 예제</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`function createReceipt() {
  const doc = new jsPDF();
  
  // 제목
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('🧾 구매 영수증', 105, 20, { align: 'center' });
  
  // 매장 정보
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Line Friends Store', 20, 40);
  doc.text('서울특별시 강남구 테헤란로 123', 20, 50);
  doc.text('사업자등록번호: 123-45-67890', 20, 60);
  
  // 거래 정보
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('거래 정보', 20, 80);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(\`거래번호: \${Date.now()}\`, 20, 95);
  doc.text(\`거래일시: \${new Date().toLocaleString('ko-KR')}\`, 20, 105);
  
  // 상품 테이블
  const tableData = [
    ['상품명', '단가', '수량', '금액'],
    ['브라운 인형 (대)', '₩25,000', '1', '₩25,000'],
    ['코니 인형 (중)', '₩18,000', '2', '₩36,000'],
    ['샐리 인형 (소)', '₩12,000', '1', '₩12,000']
  ];
  
  doc.autoTable({
    startY: 120,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [76, 175, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 9 }
  });
  
  // 합계
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text('소계: ₩73,000', 140, finalY);
  doc.text('부가세: ₩7,300', 140, finalY + 10);
  doc.text('총계: ₩80,300', 140, finalY + 20);
  
  // 감사 인사
  doc.text('감사합니다!', 105, finalY + 40, { align: 'center' });
  
  return doc;
}`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">명함 생성 예제</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`function createBusinessCard() {
  const doc = new jsPDF();
  
  // 명함 크기 (90mm x 50mm = 약 340 x 189 points)
  const cardWidth = 90;
  const cardHeight = 50;
  const startX = (210 - cardWidth) / 2;
  const startY = 30;
  
  // 명함 배경
  doc.setFillColor(25, 118, 210);
  doc.rect(startX, startY, cardWidth, cardHeight, 'F');
  
  // 회사명
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Line Friends Co., Ltd.', startX + 45, startY + 15, { align: 'center' });
  
  // 이름과 직책
  doc.setFontSize(14);
  doc.text('김라인', startX + 45, startY + 30, { align: 'center' });
  doc.text('CEO & Founder', startX + 45, startY + 40, { align: 'center' });
  
  // 연락처 정보
  doc.setFontSize(8);
  doc.text('📧 kim@linefriends.com', startX + 45, startY + 55, { align: 'center' });
  doc.text('📱 010-1234-5678', startX + 45, startY + 65, { align: 'center' });
  doc.text('📍 서울특별시 강남구 테헤란로 123', startX + 45, startY + 75, { align: 'center' });
  
  return doc;
}`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">재고 라벨 생성 예제</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`function createInventoryLabels() {
  const doc = new jsPDF();
  
  // 제목
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('🏷️ 재고 관리 라벨', 105, 20, { align: 'center' });
  
  // 라벨 데이터
  const labels = [
    { name: '브라운 인형 (대)', code: 'LF001', location: 'A-01-01', quantity: '25개' },
    { name: '코니 인형 (중)', code: 'LF002', location: 'A-02-03', quantity: '18개' },
    { name: '샐리 인형 (소)', code: 'LF003', location: 'B-01-02', quantity: '32개' }
  ];
  
  let currentY = 40;
  
  labels.forEach((label, index) => {
    // 라벨 테두리
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.rect(20, currentY, 80, 50);
    
    // 상품명
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(label.name, 25, currentY + 10);
    
    // 상품 정보
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(\`상품코드: \${label.code}\`, 25, currentY + 20);
    doc.text(\`위치: \${label.location}\`, 25, currentY + 30);
    doc.text(\`수량: \${label.quantity}\`, 25, currentY + 40);
    
    currentY += 70;
  });
  
  // 하단 정보
  doc.setFontSize(8);
  doc.text(\`생성일시: \${new Date().toLocaleString('ko-KR')}\`, 20, 250);
  doc.text('담당자: 김재고', 20, 255);
  
  return doc;
}`}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 폰트 및 다국어 지원 */}
        <div id="fonts-multilingual" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔤 폰트 및 다국어 지원</h2>
          
                     <div className="mb-6">
             <h3 className="text-lg font-medium text-gray-700 mb-3">기본 내장 폰트</h3>
             <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
               {`// jsPDF에서 기본적으로 지원하는 폰트들
const doc = new jsPDF();

// 1. Helvetica (기본값)
doc.setFont('helvetica');
doc.text('Hello World', 10, 20);

// 2. Times (Times New Roman)
doc.setFont('times');
doc.text('Hello World', 10, 40);

// 3. Courier (Courier New)
doc.setFont('courier');
doc.text('Hello World', 10, 60);

// 폰트 스타일 설정
doc.setFont('helvetica', 'normal');    // 기본
doc.setFont('helvetica', 'bold');      // 굵게
doc.setFont('helvetica', 'italic');    // 기울임
doc.setFont('helvetica', 'bolditalic'); // 굵은 기울임`}
             </SyntaxHighlighter>
            <p className="text-gray-600 text-sm">
              • <strong>Helvetica</strong>: 기본 폰트, 영어와 서유럽 언어 지원<br/>
              • <strong>Times</strong>: Times New Roman, 가독성이 좋음<br/>
              • <strong>Courier</strong>: 고정폭 폰트, 코드나 표에 적합
            </p>
          </div>

                     <div className="mb-6">
             <h3 className="text-lg font-medium text-gray-700 mb-3">지원 언어 및 제한사항</h3>
             <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
               {`// 기본 폰트로 지원되는 언어들
const doc = new jsPDF();

// ✅ 지원되는 언어들
doc.text('English: Hello World', 10, 20);
doc.text('German: Hallo Welt', 10, 30);
doc.text('French: Bonjour le monde', 10, 40);
doc.text('Spanish: Hola mundo', 10, 50);
doc.text('Italian: Ciao mondo', 10, 60);

// ❌ 지원되지 않는 언어들 (글자가 깨짐)
doc.text('한국어: 안녕하세요', 10, 70);        // 깨짐
doc.text('日本語: こんにちは', 10, 80);        // 깨짐
doc.text('中文: 你好', 10, 90);                // 깨짐
doc.text('العربية: مرحبا', 10, 100);          // 깨짐`}
             </SyntaxHighlighter>
            <p className="text-gray-600 text-sm">
              • <strong>지원 언어</strong>: 영어, 독일어, 프랑스어, 스페인어, 이탈리아어 등 서유럽 언어<br/>
              • <strong>제한 언어</strong>: 한국어, 일본어, 중국어, 아랍어 등 비서유럽 언어는 기본 폰트로 표시 불가
            </p>
          </div>

                     <div className="mb-6">
             <h3 className="text-lg font-medium text-gray-700 mb-3">커스텀 폰트 추가 (한글/일본어/중국어 지원)</h3>
             <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
               {`// 1. 폰트 파일 로드 (TTF/OTF)
import { jsPDF } from 'jspdf';

const doc = new jsPDF();

// 폰트 파일을 Base64로 변환하여 추가
const fontBase64 = 'data:font/ttf;base64,AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzL4Xy...';

// 폰트 추가
doc.addFont(fontBase64, 'CustomFont', 'normal');
doc.addFont(fontBase64, 'CustomFont', 'bold');

// 폰트 사용
doc.setFont('CustomFont');
doc.text('한글 텍스트가 제대로 표시됩니다!', 10, 20);
doc.text('日本語のテキストも正しく表示されます！', 10, 40);
doc.text('中文文本也会正确显示！', 10, 60);`}
             </SyntaxHighlighter>
          </div>

                     <div className="mb-6">
             <h3 className="text-lg font-medium text-gray-700 mb-3">Google Fonts 사용하기</h3>
             <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
               {`// Google Fonts를 사용한 다국어 지원
import { jsPDF } from 'jspdf';

const doc = new jsPDF();

// Noto Sans 폰트 추가 (한글, 일본어, 중국어 지원)
const notoSansBase64 = 'data:font/ttf;base64,AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzL4Xy...';

doc.addFont(notoSansBase64, 'NotoSans', 'normal');
doc.setFont('NotoSans');

// 이제 다국어가 제대로 표시됩니다!
doc.text('한국어: 안녕하세요!', 10, 20);
doc.text('日本語: こんにちは！', 10, 40);
doc.text('中文: 你好！', 10, 60);
doc.text('English: Hello!', 10, 80);`}
             </SyntaxHighlighter>
          </div>

                     <div className="mb-6">
             <h3 className="text-lg font-medium text-gray-700 mb-3">폰트 파일 준비 및 변환</h3>
             <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
               {`// 폰트 파일을 Base64로 변환하는 방법

// 1. Node.js에서 폰트 파일을 Base64로 변환
const fs = require('fs');
const path = require('path');

function fontToBase64(fontPath) {
  const fontBuffer = fs.readFileSync(fontPath);
  const base64Font = fontBuffer.toString('base64');
  return \`data:font/ttf;base64,\${base64Font}\`;
}

// 사용 예시
const fontBase64 = fontToBase64('./fonts/NotoSansKR-Regular.ttf');
console.log(fontBase64);

// 2. 브라우저에서 폰트 파일을 Base64로 변환
function loadFontAsBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// 사용 예시
const fileInput = document.getElementById('fontFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const fontBase64 = await loadFontAsBase64(file);
  
  const doc = new jsPDF();
  doc.addFont(fontBase64, 'CustomFont', 'normal');
  doc.setFont('CustomFont');
  doc.text('커스텀 폰트로 표시되는 텍스트', 10, 20);
});`}
             </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">실제 프로젝트에서의 다국어 지원 예제</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-3">
              <code className="text-sm text-gray-800">
                {`// 다국어 지원 PDF 생성기
import { jsPDF } from 'jspdf';

class MultilingualPDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.fonts = {};
  }

  // 폰트 등록
  async addFont(fontName, fontPath, fontStyle = 'normal') {
    try {
      const response = await fetch(fontPath);
      const fontBuffer = await response.arrayBuffer();
      const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));
      const fontDataUrl = \`data:font/ttf;base64,\${fontBase64}\`;
      
      this.doc.addFont(fontDataUrl, fontName, fontStyle);
      this.fonts[fontName] = true;
      
      console.log(\`폰트 \${fontName} (\${fontStyle}) 등록 완료\`);
    } catch (error) {
      console.error('폰트 로드 실패:', error);
    }
  }

  // 다국어 텍스트 렌더링
  renderMultilingualText(text, x, y, options = {}) {
    const { fontSize = 12, fontFamily = 'helvetica' } = options;
    
    this.doc.setFontSize(fontSize);
    
    // 폰트가 등록되어 있으면 사용, 없으면 기본 폰트 사용
    if (this.fonts[fontFamily]) {
      this.doc.setFont(fontFamily);
    } else {
      this.doc.setFont('helvetica');
    }
    
    this.doc.text(text, x, y);
  }

  // 한국어 PDF 생성
  generateKoreanPDF(data) {
    // Noto Sans KR 폰트 등록 (실제로는 미리 등록되어 있어야 함)
    this.doc.setFont('NotoSansKR');
    
    this.doc.setFontSize(18);
    this.doc.text('📋 피킹 슬립', 105, 20, { align: 'center' });
    
    this.doc.setFontSize(12);
    this.doc.text(\`회사명: \${data.companyName}\`, 20, 35);
    this.doc.text(\`주소: \${data.companyAddress}\`, 20, 45);
    this.doc.text(\`전화: \${data.companyPhone}\`, 20, 55);
    
    return this.doc;
  }

  // 일본어 PDF 생성
  generateJapanesePDF(data) {
    // Noto Sans JP 폰트 사용
    this.doc.setFont('NotoSansJP');
    
    this.doc.setFontSize(18);
    this.doc.text('📋 ピッキングスリップ', 105, 20, { align: 'center' });
    
    this.doc.setFontSize(12);
    this.doc.text(\`会社名: \${data.companyName}\`, 20, 35);
    this.doc.text(\`住所: \${data.companyAddress}\`, 20, 45);
    this.doc.text(\`電話: \${data.companyPhone}\`, 20, 55);
    
    return this.doc;
  }
}

// 사용 예시
const generator = new MultilingualPDFGenerator();

// 폰트 등록
await generator.addFont('NotoSansKR', './fonts/NotoSansKR-Regular.ttf');
await generator.addFont('NotoSansJP', './fonts/NotoSansJP-Regular.ttf');

// 한국어 PDF 생성
const koreanData = {
  companyName: '라인프렌즈 주식회사',
  companyAddress: '서울특별시 강남구 테헤란로 123',
  companyPhone: '02-1234-5678'
};

const koreanPDF = generator.generateKoreanPDF(koreanData);
koreanPDF.save('korean-picking-slip.pdf');`}
              </code>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">성능 최적화 팁</h3>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded-lg mb-3">
              {`// 폰트 성능 최적화 방법

// 1. 폰트 서브셋 사용 (필요한 문자만 포함)
const fontSubset = 'data:font/ttf;base64,AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzL4Xy...';

// 2. 폰트 캐싱
class FontCache {
  constructor() {
    this.cache = new Map();
  }

  async getFont(fontName) {
    if (this.cache.has(fontName)) {
      return this.cache.get(fontName);
    }

    const fontData = await this.loadFont(fontName);
    this.cache.set(fontName, fontData);
    return fontData;
  }

  async loadFont(fontName) {
    // 폰트 로드 로직
    const response = await fetch(\`/fonts/\${fontName}.ttf\`);
    const buffer = await response.arrayBuffer();
    return buffer;
  }
}

// 3. 웹 워커에서 폰트 처리
// main.js
const worker = new Worker('./fontWorker.js');
worker.postMessage({ type: 'LOAD_FONT', fontName: 'NotoSansKR' });

worker.onmessage = (e) => {
  if (e.data.type === 'FONT_LOADED') {
    const fontData = e.data.fontData;
    // 폰트 사용
  }
};

// fontWorker.js
self.onmessage = async (e) => {
  if (e.data.type === 'LOAD_FONT') {
    const fontData = await loadFont(e.data.fontName);
    self.postMessage({ type: 'FONT_LOADED', fontData });
  }
};`}
            </SyntaxHighlighter>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">권장 폰트 목록</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">한국어 지원</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Noto Sans KR</strong>: Google의 한국어 폰트</li>
                  <li>• <strong>Nanum Gothic</strong>: 나눔고딕</li>
                  <li>• <strong>Malgun Gothic</strong>: 맑은 고딕</li>
                  <li>• <strong>Batang</strong>: 바탕체</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">일본어/중국어 지원</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Noto Sans JP</strong>: 일본어 지원</li>
                  <li>• <strong>Noto Sans SC</strong>: 중국어 간체</li>
                  <li>• <strong>Noto Sans TC</strong>: 중국어 번체</li>
                  <li>• <strong>Source Han Sans</strong>: Adobe의 아시아 폰트</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 중요 팁</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>폰트 크기</strong>: 커스텀 폰트는 기본 폰트보다 파일 크기가 큽니다</li>
              <li>• <strong>로딩 시간</strong>: 폰트 로딩으로 인한 지연을 고려해야 합니다</li>
              <li>• <strong>폴백 폰트</strong>: 커스텀 폰트 로드 실패 시 기본 폰트로 대체하는 것이 좋습니다</li>
              <li>• <strong>폰트 서브셋</strong>: 필요한 문자만 포함하여 파일 크기를 줄이세요</li>
            </ul>
          </div>
        </div>

        {/* 링크 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔗 추가 자료</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">공식 문서</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• <a href="https://artifex.com/jsPDF/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jsPDF 공식 문서</a></li>
                <li>• <a href="https://github.com/simonbengtsson/jspdf-autotable" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jsPDF-AutoTable GitHub</a></li>
                <li>• <a href="https://github.com/parallax/jspdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jsPDF GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">예제 및 데모</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• <a href="https://artifex.com/jsPDF/examples/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jsPDF 예제</a></li>
                <li>• <a href="https://github.com/simonbengtsson/jspdf-autotable/tree/main/examples" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AutoTable 예제</a></li>
                <li>• <a href="https://stackoverflow.com/questions/tagged/jspdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stack Overflow</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
