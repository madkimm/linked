import React, { useState } from "react";
import PetSelector from "./components/PetSelector";
import ResultScreen from "./components/ResultScreen";
import "./App.css";

const App = () => {
  const [selectedPets, setSelectedPets] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // ✅ 업데이트 날짜 및 메모 설정
  const updateDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const updateMemo = "2025년 3월 환수까지 업데이트 완료";

  return (
    <div className="app-container">
      {/* ✅ 업데이트 정보 추가 */}
      <div className="update-info">
        <p><strong>업데이트 일자:</strong> {updateDate}</p>
        <p><strong>업데이트 내용:</strong> {updateMemo}</p>
        <p className="highlight-text"><strong>환수 레벨 25 기준으로 최적의 조합을 찾아줍니다.</strong> </p>
        <p className="highlight-text"><strong><span style="color: #E91E63;">탑승 환수</span>는 불멸>전설 순으로 많이 착용하는것이 최적</strong> </p>
        <p className="highlight-text"><strong><span style="color: #E91E63;">탑승 환수</span> 보스용 결속 냉정 6 = 치위 20% 최적</strong> </p>
      </div>

      {!showResult ? (
        <PetSelector setSelectedPets={setSelectedPets} setShowResult={setShowResult} />
      ) : (
        <ResultScreen selectedPets={selectedPets} setShowResult={setShowResult} />
      )}
    </div>
  );
};

export default App;
