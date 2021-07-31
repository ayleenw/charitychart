import { getCanvas } from './canvas_lib.js';

function Init() {
  let ctx = getCanvas('canvas');

  let lsMoney = localStorage.getItem('money');
  let lsBars = localStorage.getItem('barHeight');
  let lsDate = localStorage.getItem('printDate');
  let lsTime = localStorage.getItem('printTime');
  console.log(lsMoney);
  console.log(lsBars);
  console.log(lsDate);
  console.log(lsTime);

  let money = [];
  money = JSON.parse(lsMoney);
  let barHeight = [];
  barHeight = JSON.parse(lsBars);
  let printDate = [];
  printDate = JSON.parse(lsDate);
  let printTime = [];
  printTime = JSON.parse(lsTime);

  const barWidth = 100;
  const barDistance = 50;
  const bottomSpacing = 60;
  const dateField = document.getElementById('dateInput');
  const timeField = document.getElementById('timeInput');
  const moneyField = document.getElementById('moneyInput');
  let dateStamp;
  let timeStamp;
  let maxHeight = ctx.canvas.height * 0.9;
  let maxValue = 500;
  const initialMax = maxValue;
  const lineOuter = '#000';
  const lineInner = '#83aae5';
  let dataEntryVisible = false;

  ctx.canvas.addEventListener(
    'dblclick',
    function () {
      dataEntryVisible = !dataEntryVisible;
      if (dataEntryVisible) {
        document.getElementById('dataentry').style.visibility = 'visible';
      } else {
        document.getElementById('dataentry').style.visibility = 'hidden';
      }
    },
    false
  );

  let btnSave = document.getElementById('saveBtn');
  if (btnSave.addEventListener)
    btnSave.addEventListener('click', saveDataPoint, false);
  else if (btnSave.attachEvent) btnSave.attachEvent('onclick', saveDataPoint);

  let btnDelete = document.getElementById('delBtn');
  if (btnDelete.addEventListener)
    btnDelete.addEventListener('click', deleteDataPoint, false);
  else if (btnDelete.attachEvent)
    btnDelete.attachEvent('onclick', deleteDataPoint);

  function saveDataPoint() {
    dateStamp = document.getElementById('dateInput').value;
    timeStamp = document.getElementById('timeInput').value;

    const date = new Date();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + String(minutes);
    }
    if (dateStamp == '') {
      dateStamp =
        date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }
    printDate.push(dateStamp);

    if (timeStamp == '') {
      timeStamp = date.getHours() + ':' + minutes + ' Uhr';
    } else {
      timeStamp = timeStamp + ' Uhr';
    }
    printTime.push(timeStamp);

    let actInput = document.getElementById('moneyInput').value;
    money.push(actInput);

    if (checkMaxValue(actInput)) {
      recalcBars();
    } else {
      let newHeight = (parseInt(actInput, 10) / maxValue) * maxHeight;
      barHeight.push(newHeight);
    }
    dateField.value = '';
    timeField.value = '';
    moneyField.value = '';
    saveToLocalStorage();
  }

  function recalcBars() {
    barHeight = [];
    for (let i = 0; i < money.length; i++) {
      let h = (money[i] / maxValue) * maxHeight;
      barHeight.push(h);
    }
  }

  function deleteDataPoint() {
    if (money.length > 0) {
      money.length = money.length - 1;
      barHeight.length = barHeight.length - 1;
      printDate.length = printDate.length - 1;
      printTime.length = printTime.length - 1;
    }
    let max = getMaxValue();
    if (checkMaxValue(max)) recalcBars();
    saveToLocalStorage();
  }

  function getMaxValue() {
    let max = 0;
    if (money.length > 0) {
      max = money[0];
      for (let i = 1; i < money.length; i++) {
        if (money[i] > max) max = money[i];
      }
    }
    return max;
  }

  function checkMaxValue(newValue) {
    if (newValue >= maxValue) {
      do {
        maxValue += 100;
      } while (newValue >= maxValue);
      return true;
    } else if (maxValue - newValue > 100 && maxValue > initialMax) {
      do {
        maxValue -= 100;
      } while (maxValue - newValue > 100 && maxValue > initialMax);
      return true;
    } else {
      return false;
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem('money', JSON.stringify(money));
    localStorage.setItem('barHeight', JSON.stringify(barHeight));
    localStorage.setItem('printDate', JSON.stringify(printDate));
    localStorage.setItem('printTime', JSON.stringify(printTime));
  }

  function drawMeter() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '24px Arial';

    // Print lines
    ctx.strokeStyle = lineOuter;
    ctx.beginPath();
    ctx.moveTo(80, ctx.canvas.height - bottomSpacing);
    ctx.lineTo(
      ctx.canvas.width - bottomSpacing,
      ctx.canvas.height - bottomSpacing
    );
    ctx.stroke();

    let lineDistance = maxHeight / 10;
    let valueDistance = maxValue / 10;
    ctx.fillStyle = '#000';
    ctx.strokeStyle = lineInner;

    for (let i = 1; i <= 10; i++) {
      ctx.fillText(
        valueDistance * i,
        10,
        ctx.canvas.height - 42 - i * lineDistance
      );

      ctx.beginPath();
      ctx.moveTo(80, ctx.canvas.height - bottomSpacing - i * lineDistance);
      ctx.lineTo(
        ctx.canvas.width - bottomSpacing,
        ctx.canvas.height - bottomSpacing - i * lineDistance
      );
      ctx.stroke();
    }
    // Print date & time
    for (let i = 0; i < barHeight.length; i++) {
      ctx.fillStyle = '#000';
      ctx.fillText(
        printDate[i],
        (barWidth + barDistance) * (i + 1),
        ctx.canvas.height - 30
      );
      ctx.fillText(
        printTime[i],
        (barWidth + barDistance) * (i + 1),
        ctx.canvas.height
      );
      // Print bars
      ctx.fillStyle = '#029534';
      ctx.fillRect(
        (barWidth + barDistance) * (i + 1),
        ctx.canvas.height - barHeight[i] - bottomSpacing,
        barWidth,
        barHeight[i]
      );
    }
  }

  function animate() {
    drawMeter();
    window.requestAnimationFrame(animate);
  }

  animate();
}

window.onload = Init;
