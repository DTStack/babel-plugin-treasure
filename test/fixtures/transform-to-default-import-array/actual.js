import { Circle } from 'dt-react-component';

ReactDOM.render(
  <>
    <div>
      <Circle type="running"></Circle> 运行中
    </div>
    <div>
      <Circle type="finished" className="status_finished"></Circle> 成功
    </div>
  </>,
  document.getElementById('react-container'),
);
