import React, { useEffect, useState } from "react";
import "./ResultScreen.css"; // 스타일 추가

const ResultScreen = ({ selectedPets, setShowResult }) => {
  const [optimalBinding, setOptimalBinding] = useState([]);
  const [stats, setStats] = useState({
    결속합산값: 0,
    등급: "",
    세력: "",
    피해저항관통: 0,
    피해저항: 0,
    대인피해: 0,
    대인방어: 0
  });

  useEffect(() => {
    if (selectedPets.length > 0) {
      const optimal = calculateOptimalBinding(selectedPets);
      setOptimalBinding(optimal);
      setStats(calculateStats(optimal));
    }
  }, [selectedPets]);

  // ✅ 최적의 결속 리스트 계산 (합산 값 높은 순 정렬 후 최대 6마리 선택)
  const calculateOptimalBinding = (pets) => {
    return pets
      .sort((a, b) => (b.피해저항관통 + b.피해저항 + b.대인피해 * 10 + b.대인방어 * 10) - 
                        (a.피해저항관통 + a.피해저항 + a.대인피해 * 10 + a.대인방어 * 10))
      .slice(0, 6);
  };

  // ✅ 결속 합산 값 & 등급/세력 개수 계산
const calculateStats = (pets) => {
  let total = { 결속합산값: 0, 피해저항관통: 0, 피해저항: 0, 대인피해: 0, 대인방어: 0 };
  let 등급별 = { 불멸: 0, 전설: 0 };
  let 세력별 = {};
  let 등급세트효과 = { 피해저항관통: 0, 피해저항: 0, 대인피해: 0, 대인방어: 0 };
  let 세력세트효과 = { 피해저항관통: 0, 피해저항: 0 };

  pets.forEach((pet) => {
    let 피해저항관통 = parseFloat(pet.피해저항관통) || 0;
    let 피해저항 = parseFloat(pet.피해저항) || 0;
    let 대인피해 = parseFloat(pet["대인피해%"]) || 0;
    let 대인방어 = parseFloat(pet["대인방어%"]) || 0;

    let 합산값 = 피해저항관통 + 피해저항 + 대인피해 + 대인방어;
    total.결속합산값 += 합산값;
    total.피해저항관통 += 피해저항관통;
    total.피해저항 += 피해저항;
    total.대인피해 += 대인피해;
    total.대인방어 += 대인방어;

    // 등급 개수 카운트
    if (pet.grade === "불멸") 등급별.불멸 += 1;
    if (pet.grade === "전설") 등급별.전설 += 1;

    // 세력 개수 카운트
    if (pet.influence) {
      세력별[pet.influence] = (세력별[pet.influence] || 0) + 1;
    }
  });

  // ✅ 등급 세트 효과 계산
  if (등급별["전설"] >= 4) 등급세트효과.피해저항관통 += 100;
  if (등급별["전설"] >= 6) 등급세트효과.피해저항 += 100;
  if (등급별["불멸"] >= 2) 등급세트효과.피해저항관통 += 150;
  if (등급별["불멸"] >= 3) 등급세트효과.피해저항 += 150;
  if (등급별["불멸"] >= 5) {
    등급세트효과.대인피해 += 20;
    등급세트효과.대인방어 += 20;
  }

  // ✅ 세력 세트 효과 계산
  Object.keys(세력별).forEach((세력) => {
    const 개수 = 세력별[세력];
    if (["결의", "고요", "냉정"].includes(세력)) {
      if (개수 >= 2) 세력세트효과.피해저항관통 += 30;
      if (개수 >= 3) 세력세트효과.피해저항관통 += 50;
      if (개수 >= 4) 세력세트효과.피해저항관통 += 80;
      if (개수 >= 5) 세력세트효과.피해저항관통 += 90;
      if (개수 >= 6) 세력세트효과.피해저항관통 += 130;
    }
    if (["의지", "침착", "활력"].includes(세력)) {
      if (개수 >= 2) 세력세트효과.피해저항 += 50;
      if (개수 >= 3) 세력세트효과.피해저항 += 80;
      if (개수 >= 4) 세력세트효과.피해저항 += 130;
      if (개수 >= 5) 세력세트효과.피해저항 += 150;
      if (개수 >= 6) 세력세트효과.피해저항 += 200;
    }
  });

  // ✅ 등급 & 세력 문자열 생성
  let 등급 = "";
  if (등급별.불멸 > 0) 등급 += `${등급별.불멸}불멸 `;
  if (등급별.전설 > 0) 등급 += `${등급별.전설}전설`;

  let 세력 = Object.entries(세력별)
    .map(([key, value]) => `${value}${key}`)
    .join(" ");

  return { ...total, 등급: 등급.trim(), 세력: 세력.trim(), 등급세트효과, 세력세트효과 };
};

  return (
    <div className="result-container">
      <h2>최적 결속 결과</h2>

      <div className="result-list">
  {optimalBinding.map((pet, index) => (
    <div key={index} className="result-item">
      <img
        src={pet.iconPath ? process.env.PUBLIC_URL + pet.iconPath : process.env.PUBLIC_URL + `/icons/${pet.ic}.png`}
        alt={pet.name}
        className="result-icon"
        onError={(e) => {
          e.target.src = process.env.PUBLIC_URL + "/icons/none.png";
        }}
      />
      <p>{pet.name}</p>
    </div>
  ))}
</div>


<div className="stats">
  <p><strong>결속 합산값 :</strong> {Math.floor(stats?.결속합산값 ?? 0)}</p>
  {/* 속성 총합: 모든 값이 0이면 표시 안 함 */}
  {(stats?.피해저항관통 > 0 || stats?.피해저항 > 0 || stats?.대인피해 > 0 || stats?.대인방어 > 0) && (
    <p><strong>속성 총합 :</strong> 
      {stats?.피해저항관통 > 0 && ` 피해저항관통 ${Math.floor(stats.피해저항관통)},`}
      {stats?.피해저항 > 0 && ` 피해저항 ${Math.floor(stats.피해저항)},`}
      {stats?.대인피해 > 0 && ` 대인피해 ${Math.floor(stats.대인피해)}%,`}
      {stats?.대인방어 > 0 && ` 대인방어 ${Math.floor(stats.대인방어)}%`}
    </p>
  )}
  {/* ✅ 등급 결과 표시 (전설 = 빨간색, 불멸 = 금색) */}
{stats?.등급 && (
  <p>
    <strong>등급 :</strong>{" "}
    {stats.등급.split(" ").map((grade, index) => (
      <span
        key={index}
        className={`grade ${
          grade.includes("전설") ? "legendary" : grade.includes("불멸") ? "immortal" : ""
        }`}
      >
        {grade}{" "}
      </span>
    ))}
  </p>
)}


  {/* 등급 세트 효과: 모든 값이 0이면 표시 안 함 */}
  {(stats?.등급세트효과?.피해저항관통 > 0 || stats?.등급세트효과?.피해저항 > 0 || 
    stats?.등급세트효과?.대인피해 > 0 || stats?.등급세트효과?.대인방어 > 0) && (
    <p>
      <strong>등급 세트 효과 :</strong> 
      {stats.등급세트효과?.피해저항관통 > 0 && ` 피해저항관통 ${Math.floor(stats.등급세트효과.피해저항관통)},`}
      {stats.등급세트효과?.피해저항 > 0 && ` 피해저항 ${Math.floor(stats.등급세트효과.피해저항)},`}
      {stats.등급세트효과?.대인피해 > 0 && ` 대인피해 ${Math.floor(stats.등급세트효과.대인피해)}%,`}
      {stats.등급세트효과?.대인방어 > 0 && ` 대인방어 ${Math.floor(stats.등급세트효과.대인방어)}%`}
    </p>
  )}

  {stats?.세력 && <p><strong>세력 :</strong> {stats.세력}</p>}

  {/* 세력 세트 효과: 모든 값이 0이면 표시 안 함 */}
  {(stats?.세력세트효과?.피해저항관통 > 0 || stats?.세력세트효과?.피해저항 > 0) && (
    <p>
      <strong>세력 세트 효과 :</strong> 
      {stats.세력세트효과?.피해저항관통 > 0 && ` 피해저항관통 ${Math.floor(stats.세력세트효과.피해저항관통)},`}
      {stats.세력세트효과?.피해저항 > 0 && ` 피해저항 ${Math.floor(stats.세력세트효과.피해저항)}`}
    </p>
  )}


</div>


      <button className="back-btn" onClick={() => setShowResult(false)}>
        다시 선택하기
      </button>
    </div>
  );
};

export default ResultScreen;
