import { ImageHotArea } from "./components/ImageHotArea"
import './index.less';

function App() {
  return (
    <div className="app">
      <ImageHotArea
        src="https://bmids.cdn.bcebos.com/images/e7f2cf95ee7865277524367b6f5f5b76-toutu.png"
        width={375}
        height={316}
      />
    </div>
  )
}

export default App
