import { getCanvas } from './canvas_lib.js';

function Init() {
  let ctx = getCanvas('canvas');
  let barWidth = 80;
  let barHeight = 0;
  let maxHeight = ctx.canvas.height * 0.9;
  let maxValue = 500;
  const lineOuter = '#000';
  const lineInner = '#83aae5';
  let money = [];
  let dataEntryVisible = false;
  console.log(maxHeight);

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
    let actInput = document.getElementById('moneyInput').value;
    barHeight = (parseInt(actInput, 10) / maxValue) * maxHeight;
    money.push(barHeight);
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
    ctx.fillStyle = '#029534';
    for (let i = 0; i <= money.length; i++) {
      ctx.fillRect(
        100 * (i + 1),
        ctx.canvas.height - money[i] - 50,
        barWidth,
        money[i]
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
