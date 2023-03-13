import '../App.css';
import React from 'react';

const Testings = () => {


  const [data, setData] = React.useState<any>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [data]);

  return (
    <div>
      {data ? <div>{JSON.stringify(data)}</div> : <div>Loading...</div>}

      <br />


    </div>
  );



}


export default Testings;    