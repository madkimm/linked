import React, { useState, useEffect } from "react";
import "./PetSelector.css"; // 스타일 파일 추가

const PetSelector = ({ setSelectedPets, setShowResult }) => {
  const [pets, setPets] = useState([]);
  const [selectedTab, setSelectedTab] = useState("수호");
  const [selectedPets, setLocalSelectedPets] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/linked_data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("로드된 데이터:", data);
        setPets(data);
      })
      .catch((error) => console.error("데이터 로딩 오류:", error));
  }, []);

  const filteredPets = pets
  .filter((pet) => pet.type === selectedTab)
  .sort((a, b) => {
    if (a.grade === "전설" && b.grade === "불멸") return -1;
    if (a.grade === "불멸" && b.grade === "전설") return 1;
    return 0; // 같은 등급이면 기존 정렬 유지
  });

  const MAX_SELECTION = 30;

  const handleSelect = (pet) => {
    if (selectedPets.includes(pet)) {
      setLocalSelectedPets(selectedPets.filter((p) => p !== pet));
    } else {
      if (selectedPets.length < MAX_SELECTION) {
        setLocalSelectedPets([...selectedPets, pet]);
      } else {
        alert(`최대 ${MAX_SELECTION}개까지 선택할 수 있습니다!`);
      }
    }
  };

  const handleCalculate = () => {
    setSelectedPets(selectedPets); // 부모 컴포넌트(App.js)에 선택된 환수 저장
    setShowResult(true); // 결과 화면으로 전환
  };

  return (
    <div className="pet-container">
      <h2>환수 선택</h2>

      <div className="tab-buttons">
        <button className={selectedTab === "수호" ? "active" : ""} onClick={() => setSelectedTab("수호")}>
          수호
        </button>
        <button className={selectedTab === "변신" ? "active" : ""} onClick={() => setSelectedTab("변신")}>
          변신
        </button>
      </div>

      <div className="pet-list">
  {filteredPets.length === 0 ? (
    <p>데이터 없음</p>
  ) : (
    filteredPets.map((pet, index) => {
      const iconPath = pet.iconPath
        ? process.env.PUBLIC_URL + pet.iconPath
        : process.env.PUBLIC_URL + `/icons/${pet.ic}.png`;

      return (
        <div key={index} className={`pet-item ${selectedPets.includes(pet) ? "selected" : ""}`} onClick={() => handleSelect(pet)}>
          <img
            src={iconPath}
            alt={pet.name}
            className="pet-icon"
            onError={(e) => {
              e.target.src = process.env.PUBLIC_URL + "/icons/none.png";
            }}
          />
          <p className="pet-name">{pet.name}</p>
        </div>
      );
    })
  )}
</div>


      <div className="selected-pets">
        <h3>선택된 {selectedTab} 환수 ({selectedPets.length} / {MAX_SELECTION})</h3>
        <button className="calculate-btn" onClick={handleCalculate} disabled={selectedPets.length === 0}>
          계산하기
        </button>
      </div>
    </div>
  );
};

export default PetSelector;
