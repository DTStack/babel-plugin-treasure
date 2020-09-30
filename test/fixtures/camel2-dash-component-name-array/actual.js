import { Circle } from 'dt-react-component';

ReactDOM.render(
  <>
    <div>
      <Circle type="running"></Circle>&nbsp; 运行中
    </div>
    <div>
      <Circle type="finished" className="status_finished"></Circle>&nbsp; 成功
    </div>
  </>,
  document.getElementById('react-container'),
);
