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
  const updateMemo = "2025년 1월 환수까지 업데이트 완료";

  return (
    <div className="app-container">
      {/* ✅ 업데이트 정보 추가 */}
      <div className="update-info">
        <p><strong>업데이트 일자:</strong> {updateDate}</p>
        <p><strong>업데이트 내용:</strong> {updateMemo}</p>
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
