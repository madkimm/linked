import React, { useEffect, useState } from "react";
import "./ResultScreen.css"; // 스타일 추가

const ResultScreen = ({ selectedPets, setShowResult }) => {
  const [optimalBinding, setOptimalBinding] = useState([]);
  const [stats, setStats] = useState({
    결속합산값: 0,
    속성총합: { 피해저항관통: 0, 피해저항: 0, 대인피해: 0, 대인방어: 0 },
    등급: "",
    등급세트효과: { 피해저항관통: 0, 피해저항: 0, 대인피해: 0, 대인방어: 0 },
    세력: "",
    세력세트효과: { 피해저항관통: 0, 피해저항: 0 }
  });

  useEffect(() => {
    if (selectedPets.length > 0) {
      const optimal = calculateOptimalBinding(selectedPets);
      setOptimalBinding(optimal);
      setStats(calculateStats(optimal));
    }
  }, [selectedPets]);

const getCombinations = (arr, selectNumber) => {
  const results = [];
  if (selectNumber === 1) return arr.map((item) => [item]);
  
  arr.forEach((fixed, index, origin) => {
    const rest = origin.slice(index + 1);
    const combinations = getCombinations(rest, selectNumber - 1);
    const attached = combinations.map((comb) => [fixed, ...comb]);
    results.push(...attached);
  });

  return results;
};

const calculateOptimalBinding = (pets) => {
  if (pets.length <= 6) return pets; // 6개 이하라면 그대로 사용

  const combinations = getCombinations(pets, 6); // 가능한 모든 조합 생성
  let bestCombination = [];
  let maxValue = 0;

  combinations.forEach((comb) => {
    const stats = calculateStats(comb);
    if (stats.결속합산값 > maxValue) {
      maxValue = stats.결속합산값;
      bestCombination = comb;
    }
  });

  return bestCombination;
};

const calculateStats = (pets) => {
  let total = { 결속합산값: 0, 피해저항관통: 0, 피해저항: 0, 대인피해: 0, 대인방어: 0 };
  let 등급별 = { 불멸: 0, 전설: 0 };
  let 세력별 = {};
  let 수호불멸 = 0, 변신불멸 = 0; // 수호와 변신의 불멸 개수 구분
  let 수호전설 = 0, 변신전설 = 0; // 수호와 변신의 전설 개수 구분
  let 등급세트효과 = { 피해저항관통: 0, 피해저항: 0, 대인피해: 0, 대인방어: 0 };
  let 세력세트효과 = { 피해저항관통: 0, 피해저항: 0 };

  pets.forEach((pet) => {
    let 피해저항관통 = parseFloat(pet.피해저항관통) || 0;
    let 피해저항 = parseFloat(pet.피해저항) || 0;
    let 대인피해 = parseFloat(pet["대인피해%"]) || 0;
    let 대인방어 = parseFloat(pet["대인방어%"]) || 0;

    total.피해저항관통 += 피해저항관통;
    total.피해저항 += 피해저항;
    total.대인피해 += 대인피해;
    total.대인방어 += 대인방어;

    if (pet.grade === "불멸") {
      등급별.불멸 += 1;
      if (pet.type === "수호") 수호불멸 += 1;
      else 변신불멸 += 1;
    }
    if (pet.grade === "전설") {
      등급별.전설 += 1;
      if (pet.type === "수호") 수호전설 += 1;
      else 변신전설 += 1;
    }

    if (pet.influence) {
      세력별[pet.influence] = (세력별[pet.influence] || 0) + 1;
    }
  });

// ✅ 등급 세트 효과 계산 (불멸 + 전설 조합 적용)
if (등급별["전설"] >= 6) {
  등급세트효과.피해저항관통 += 100;
  등급세트효과.피해저항 += 100;
} else if (등급별["전설"] >= 4) {
  등급세트효과.피해저항관통 += 100;
}

// ✅ 불멸 효과 적용 (수호/변신 구분)
if (수호불멸 >= 6) {
  등급세트효과.피해저항관통 += 200;
  등급세트효과.피해저항 += 150;
  등급세트효과.대인피해 += 20;
  등급세트효과.대인방어 += 20;
} else if (수호불멸 >= 5) {
  등급세트효과.피해저항관통 += 200;
  등급세트효과.피해저항 += 150;
  등급세트효과.대인피해 += 20;
} else if (수호불멸 >= 3) {
  등급세트효과.피해저항관통 += 200;
  등급세트효과.피해저항 += 150;
} else if (수호불멸 >= 2) {
  등급세트효과.피해저항관통 += 200;
}

if (변신불멸 >= 6) {
  등급세트효과.피해저항관통 += 150;
  등급세트효과.피해저항 += 150;
  등급세트효과.대인피해 += 20;
  등급세트효과.대인방어 += 20;
} else if (변신불멸 >= 5) {
  등급세트효과.피해저항관통 += 150;
  등급세트효과.피해저항 += 150;
  등급세트효과.대인피해 += 20;
} else if (변신불멸 >= 3) {
  등급세트효과.피해저항관통 += 150;
  등급세트효과.피해저항 += 150;
} else if (변신불멸 >= 2) {
  등급세트효과.피해저항관통 += 150;
}


  // ✅ 세력 세트 효과 (수호/변신 구분)
Object.keys(세력별).forEach((세력) => {
  const 개수 = 세력별[세력];

  if (["결의", "고요", "의지"].includes(세력)) {
    if (pets.every((pet) => pet.type === "수호")) {
      세력세트효과.피해저항 += 개수 >= 6 ? 200 :
                             개수 >= 5 ? 150 :
                             개수 >= 4 ? 130 :
                             개수 >= 3 ? 80 :
                             개수 >= 2 ? 50 : 0;
    } else if (pets.every((pet) => pet.type === "변신")) {
      세력세트효과.피해저항관통 += 개수 >= 6 ? 130 :
                                개수 >= 5 ? 90 :
                                개수 >= 4 ? 80 :
                                개수 >= 3 ? 50 :
                                개수 >= 2 ? 30 : 0;
    }
  }

  if (["침착", "냉정", "활력"].includes(세력)) {
    if (pets.every((pet) => pet.type === "변신")) {
      세력세트효과.피해저항 += 개수 >= 6 ? 200 :
                             개수 >= 5 ? 150 :
                             개수 >= 4 ? 130 :
                             개수 >= 3 ? 80 :
                             개수 >= 2 ? 50 : 0;
    } else if (pets.every((pet) => pet.type === "수호")) {
      세력세트효과.피해저항관통 += 개수 >= 6 ? 130 :
                                개수 >= 5 ? 90 :
                                개수 >= 4 ? 80 :
                                개수 >= 3 ? 50 :
                                개수 >= 2 ? 30 : 0;
    }
  }
});
total.결속합산값 =
  (total.피해저항관통 + total.피해저항 + total.대인피해 * 10 + total.대인방어 * 10) +
  (등급세트효과.피해저항관통 + 등급세트효과.피해저항 + 등급세트효과.대인피해 * 10 + 등급세트효과.대인방어 * 10) +
  (세력세트효과.피해저항관통 + 세력세트효과.피해저항);
  return { 
    결속합산값: total.결속합산값, 
    속성총합: total, 
    등급: `${등급별.불멸}불멸 ${등급별.전설}전설`.trim(),
    등급세트효과, 
    세력: Object.entries(세력별).map(([key, value]) => `${value}${key}`).join(" "), 
    세력세트효과 
  };
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

<table className="stats-table">
  <tbody>
    <tr>
      <th>결속 합산값</th>
      <td>{Math.floor(stats.결속합산값)}</td>
    </tr>

    <tr>
      <th>속성 총합</th>
      <td>
        {[stats.속성총합.피해저항관통 > 0 && `피해저항관통 ${Math.floor(stats.속성총합.피해저항관통)}`,
          stats.속성총합.피해저항 > 0 && `피해저항 ${Math.floor(stats.속성총합.피해저항)}`,
          stats.속성총합.대인피해 > 0 && `대인피해 ${Math.floor(stats.속성총합.대인피해)}%`,
          stats.속성총합.대인방어 > 0 && `대인방어 ${Math.floor(stats.속성총합.대인방어)}%`]
          .filter(Boolean)
          .join(" ")}
      </td>
    </tr>

    {stats.등급 && (
      <tr>
        <th>등급</th>
        <td>{stats.등급}</td>
      </tr>
    )}

    {(stats.등급세트효과.피해저항관통 > 0 || stats.등급세트효과.피해저항 > 0 || stats.등급세트효과.대인피해 > 0 || stats.등급세트효과.대인방어 > 0) && (
      <tr>
        <th>등급 세트 효과</th>
        <td>
          {[stats.등급세트효과.피해저항관통 > 0 && `피해저항관통 ${Math.floor(stats.등급세트효과.피해저항관통)}`,
            stats.등급세트효과.피해저항 > 0 && `피해저항 ${Math.floor(stats.등급세트효과.피해저항)}`,
            stats.등급세트효과.대인피해 > 0 && `대인피해 ${Math.floor(stats.등급세트효과.대인피해)}%`,
            stats.등급세트효과.대인방어 > 0 && `대인방어 ${Math.floor(stats.등급세트효과.대인방어)}%`]
            .filter(Boolean)
            .join(" ")}
        </td>
      </tr>
    )}

    {stats.세력 && (
      <tr>
        <th>세력</th>
        <td>{stats.세력}</td>
      </tr>
    )}

    {(stats.세력세트효과.피해저항관통 > 0 || stats.세력세트효과.피해저항 > 0) && (
      <tr>
        <th>세력 세트 효과</th>
        <td>
          {[stats.세력세트효과.피해저항관통 > 0 && `피해저항관통 ${Math.floor(stats.세력세트효과.피해저항관통)}`,
            stats.세력세트효과.피해저항 > 0 && `피해저항 ${Math.floor(stats.세력세트효과.피해저항)}`]
            .filter(Boolean)
            .join(" ")}
        </td>
      </tr>
    )}
  </tbody>
</table>




      <button className="back-btn" onClick={() => setShowResult(false)}>
        다시 선택하기
      </button>
    </div>
  );
};

export default ResultScreen;
