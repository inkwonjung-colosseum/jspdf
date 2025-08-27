import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  ClipboardDocumentIcon,
  ArrowDownOnSquareIcon,
  CogIcon,
  CheckIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline";

export default function CodeEditor({ 
  code = '', 
  title = 'Generated jsPDF Code',
  onOptionsChange = () => {}
}) {
  const [copied, setCopied] = useState(false);
  const [codeOptions, setCodeOptions] = useState({
    template: 'function',
    functionName: 'createPickingSlipPDF',
    exportType: 'export',
    includeImports: true
  });
  const [showOptions, setShowOptions] = useState(false);

  // 코드 복사 함수
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('코드 복사 실패:', error);
      // 폴백: 텍스트 영역 생성해서 복사
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 코드 다운로드 함수
  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${codeOptions.functionName}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 옵션 변경 핸들러
  const handleOptionChange = (key, value) => {
    const newOptions = { ...codeOptions, [key]: value };
    setCodeOptions(newOptions);
    onOptionsChange(newOptions);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-gray-500" />
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          {/* 설정 버튼 */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="코드 생성 옵션"
          >
            <CogIcon className="h-4 w-4" />
          </button>

          {/* 복사 버튼 */}
          <button
            onClick={handleCopyCode}
            disabled={!code.trim()}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              copied 
                ? 'bg-green-500 text-white'
                : code.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={copied ? '복사됨!' : '코드 복사'}
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-1" />
                복사됨!
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                복사
              </>
            )}
          </button>

          {/* 다운로드 버튼 */}
          <button
            onClick={handleDownloadCode}
            disabled={!code.trim()}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              code.trim()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="JS 파일로 다운로드"
          >
            <ArrowDownOnSquareIcon className="h-4 w-4 mr-1" />
            다운로드
          </button>
        </div>
      </div>

      {/* 코드 생성 옵션 패널 */}
      {showOptions && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">코드 생성 옵션</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* 함수 타입 선택 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                함수 타입
              </label>
              <select
                value={codeOptions.template}
                onChange={(e) => handleOptionChange('template', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="function">function</option>
                <option value="arrow">arrow function</option>
              </select>
            </div>

            {/* 함수명 입력 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                함수명
              </label>
              <input
                type="text"
                value={codeOptions.functionName}
                onChange={(e) => handleOptionChange('functionName', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="함수명 입력"
              />
            </div>

            {/* Export 타입 선택 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Export 타입
              </label>
              <select
                value={codeOptions.exportType}
                onChange={(e) => handleOptionChange('exportType', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="export">export</option>
                <option value="default">export default</option>
                <option value="none">export 없음</option>
              </select>
            </div>

            {/* Import 포함 여부 */}
            <div className="flex items-center">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={codeOptions.includeImports}
                  onChange={(e) => handleOptionChange('includeImports', e.target.checked)}
                  className="mr-2 focus:ring-2 focus:ring-blue-500"
                />
                Import 구문 포함
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 코드 표시 영역 */}
      <div className="flex-1 overflow-hidden">
        {code.trim() ? (
          <div className="h-full overflow-auto border border-gray-200 rounded-lg">
            <SyntaxHighlighter 
              language="javascript" 
              style={tomorrow}
              customStyle={{
                margin: 0,
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.5',
                height: '100%',
                overflow: 'auto'
              }}
              showLineNumbers={true}
              wrapLines={true}
              wrapLongLines={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <div className="text-lg mb-2 font-medium">코드가 생성되지 않았습니다</div>
            <div className="text-sm text-center max-w-md">
              왼쪽에서 PDF 내용을 입력하고 "Generate PDF" 버튼을 클릭하면<br/>
              여기에 jsPDF 코드가 자동으로 생성됩니다.
            </div>
          </div>
        )}
      </div>

      {/* 하단 안내 */}
      {code.trim() && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>💡 사용법:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• 복사 버튼을 클릭해서 다른 프로젝트에 붙여넣기</li>
              <li>• 다운로드 버튼으로 .js 파일로 저장</li>
              <li>• 설정 버튼으로 코드 형태 변경 가능</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}