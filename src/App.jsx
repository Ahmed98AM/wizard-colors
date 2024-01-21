import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import './App.css';

function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://wizard-world-api.herokuapp.com/houses');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setApiData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const extractColors = (houseColours) => {
    const [color1, color2] = houseColours.split(' and ');
    return [color1.trim(), color2.trim()];
  };

  return (
    <>
      <div className="m-auto items-center justify-center h-[80vh] w-[50vw] ">
        {loading ? (
          <div className="spinner-container">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Loading...</p>
          </div>
        ) : (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={apiData.length}
                rowHeight={150} 
                rowRenderer={({ key, index, style }) => {
                  const house = apiData[index];
                  const colors = extractColors(house.houseColours);
                  const gradient =
                    CSS.supports('color', colors?.[0]) && CSS.supports('color', colors?.[1])
                      ? `linear-gradient(to right, ${colors.join(', ')})`
                      : 'linear-gradient(to right, white, black)';

                  return (
                    <div  key={key} style={{ ...style, display: 'flex', justifyContent: 'center' }}>
                      <div
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}                       
                        className="w-[20em] h-[6em] m-2 overflow-hidden relative"
                      >
                        <div
                          className="absolute inset-y-0 left-0 right-0 rounded-sm"
                          style={{
                            background: gradient,
                            height: '10%',
                            top: '50%',
                          }}
                        ></div>
                        <p className="text-black absolute top-0 left-0 m-2 text-lg font-bold">
                          {house.name}
                        </p>
                        <p className="text-black absolute top-0 right-0 m-2 text-sm">
                          {house.animal}
                        </p>
                        <p className="text-black absolute bottom-0 left-0 m-2 text-sm">
                          Founder: <span className="font-bold">{house.founder}</span>
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </AutoSizer>
        )}
      </div>
    </>
  );
}

export default App;
