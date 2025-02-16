import React, { useState } from "react";
import PetSelector from "./components/PetSelector";
import ResultScreen from "./components/ResultScreen";

function App() {
  const [selectedPets, setSelectedPets] = useState([]); // 선택된 환수 목록
  const [showResult, setShowResult] = useState(false); // 결과 화면 전환 상태

  return (
    <div className="App">
      {!showResult ? (
        <PetSelector setSelectedPets={setSelectedPets} setShowResult={setShowResult} />
      ) : (
        <ResultScreen selectedPets={selectedPets} setShowResult={setShowResult} />
      )}
    </div>
  );
}

export default App;
