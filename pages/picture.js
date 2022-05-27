
import { useRef } from 'react';

const Picture = (props) => {
  const fileName = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fileName.current.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='file' ref={fileName} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
};

export default Picture;