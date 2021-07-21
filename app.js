import { getCanvas } from './canvas_lib.js';

function Init() {
  let ctx = getCanvas('canvas');
  let money = [];
  let barWidth = 80;
  let barHeight = [];
  let maxHeight = ctx.canvas.height * 0.9;
  let maxValue = 500;
  let printDate;
  let printTime;
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

  let el = document.getElementById('saveBtn');
  if (el.addEventListener) el.addEventListener('click', saveDataPoint, false);
  else if (el.attachEvent) el.attachEvent('onclick', saveDataPoint);

  function saveDataPoint() {
    const date = new Date();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + String(minutes);
    }
    printDate =
      date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    printTime = date.getHours() + ':' + minutes + ' Uhr';

    let actInput = document.getElementById('moneyInput').value;
    money.push(actInput);

    if (actInput >= maxValue) {
      do {
        maxValue += 100;
      } while (actInput >= maxValue);

      barHeight = [];
      for (let i = 0; i < money.length; i++) {
        let h = (money[i] / maxValue) * maxHeight;
        barHeight.push(h);
      }
    } else {
      let newHeight = (parseInt(actInput, 10) / maxValue) * maxHeight;
      barHeight.push(newHeight);
    }
  }

  function drawMeter() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '24px Arial';

    ctx.strokeStyle = lineOuter;
    ctx.beginPath();
    ctx.moveTo(80, ctx.canvas.height - 50);
    ctx.lineTo(ctx.canvas.width - 50, ctx.canvas.height - 50);
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
      ctx.moveTo(80, ctx.canvas.height - 50 - i * lineDistance);
      ctx.lineTo(
        ctx.canvas.width - 50,
        ctx.canvas.height - 50 - i * lineDistance
      );
      ctx.stroke();
    }
    for (let i = 0; i < barHeight.length; i++) {
      ctx.fillStyle = '#000';
      ctx.fillText(printDate, 120 * (i + 1), ctx.canvas.height - 20);
      ctx.fillStyle = '#029534';
      ctx.fillRect(
        120 * (i + 1),
        ctx.canvas.height - barHeight[i] - 50,
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
