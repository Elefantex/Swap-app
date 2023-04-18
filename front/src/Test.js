import React, { useEffect, useState } from "react";
import "./Test.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import PuffLoader from "react-spinners/ClipLoader";
import { getSwaps } from "./app/slices";




const Test = () => {
  const fecha = new Date();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mes, setMes] = useState(fecha.getMonth());
  const [anio, setAnio] = useState(fecha.getFullYear());
  const [prueba, setPrueba] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const id = JSON.parse(localStorage.getItem('IDUserLogin'));
  useEffect(() => {
    if (!id) {
      navigate("/")
    }
  }, [])
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([])
  const roster = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  let [color, setColor] = useState("#000000");


  useEffect(() => {
    const getSwapsFromDatabase = async () => {
      try {
        setIsLoading(true);
        const swaps = await getSwaps();
        setData(swaps);
        setOriginalData(swaps);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    getSwapsFromDatabase();
  }, [setData, setOriginalData]);




  useEffect(() => {
    crearMes();
  }, [mes, anio, data]);


  const crearMes = () => {
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDiaEnSemana = new Date(anio, mes, 1).getDay();
    const primerDiaMostrado = (primerDiaEnSemana === 0) ? 6 : (primerDiaEnSemana - 1); // adjust the value to start on Monday
    const filas = [[]];

    for (let i = 0; i < primerDiaMostrado; i++) {
      filas[0].push("");
    }

    let dia = 1;
    for (let i = primerDiaMostrado; i < 7; i++) {
      filas[0].push(dia);
      dia++;
    }

    while (dia <= diasEnMes) {
      const ultimaFila = filas[filas.length - 1];
      if (ultimaFila.length === 7) {
        filas.push([]);
      }
      filas[filas.length - 1].push(dia);
      dia++;
    }

    setPrueba(filas);
  };
  const [newCheckedValues, setNewCheckedValues] = useState([])
  const filterRoster = () => {
    const checkboxes = document.getElementsByName('roster');
    const checkedValues = [];
    console.log(checkedValues)

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkedValues.push(checkboxes[i].value);
        console.log(checkboxes[i].value)

      }

    }

    if (checkedValues.length === 0) {
      // If no checkboxes are checked, assume the user wants to select all options
      setData(originalData);
      setNewCheckedValues(checkedValues)

      return;
    }

    const newDataFilterRoster = originalData.filter((dataRoster) => {
      return checkedValues.includes(dataRoster.roster);
    });

    setData(newDataFilterRoster);
    //console.log(newDataFilterRoster);
    setNewCheckedValues(checkedValues)
    console.log(checkedValues)

  }
  console.log(newCheckedValues)


  const mesSiguiente = () => {
    if (mes === 11) {
      setMes(0);
      setAnio(anio + 1);
    } else {
      setMes(mes + 1);
    }
  };

  const mesAnterior = () => {
    if (mes === 0) {
      setMes(11);
      setAnio(anio - 1);
    } else {
      setMes(mes - 1);
    }
  };
  const [showRoster, setShowRoster] = useState(true);
  const [selectedRoster, setSelectedRoster] = useState([]);
  const handleSelectRoster = () => {
    setShowRoster(!showRoster);
  };


  return (
    <div className="calendario">
      <div className="mes">
        <div className="">
          <button className="botonIzq" onClick={mesAnterior}>
          {"<"}
          </button>
        </div>
        <div className="mesTexto">
          {new Date(anio, mes).toLocaleString("default", {
            month: "long",
          })}{" "}
          {anio}
        </div>
        <div className="">
          <button className="botonDer" onClick={mesSiguiente}>
            {">"}
          </button>
        </div>
        <div> <PuffLoader
          color={color}
          loading={isLoading}
          size={30}
          speedMultiplier="0.8"
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        </div>
      </div>
      <div>Roster:

        {roster.map((item) => {
          return (
            <>
              <label className="" style={{ margin: "10px" }}><b>{item}</b>
                <input className="" type="checkbox" name="roster" id="roster-`${item}`" onChange={filterRoster} value={item} />
              </label>
            </>
          )
        })}



      </div>
      <table className="tabla">
        <thead>
          <tr>
            <th>L</th>
            <th>M</th>
            <th>X</th>
            <th>J</th>
            <th>V</th>
            <th>S</th>
            <th>D</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(prueba).map((key, i) => {
            return (
              <tr>
                {prueba[key].map((item, i) => {
                  const formattedItem = item ? item.toString().padStart(2, "0") : "";
                  const formattedMonth = (mes + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
                  const cellDate = `${anio}-${formattedMonth}-${formattedItem}`;

                  const RankUser = localStorage.getItem('Rank');

                  const dataMatchSwap = data.find((dataItem) => {
                    if (JSON.parse(RankUser) === "JU") {
                      return dataItem.date === cellDate && (dataItem.rank === RankUser || dataItem.rank === `"JUPU"`) && dataItem.tipoSwap === "Swap";
                    } else if (JSON.parse(RankUser) === "JUPU") {
                      return dataItem.date === cellDate && (dataItem.rank === `"JU"` || dataItem.rank === RankUser || dataItem.rank === `"PU"`) && dataItem.tipoSwap === "Swap";
                    } else if (JSON.parse(RankUser) === "PU") {
                      return dataItem.date === cellDate && (dataItem.rank === `"JUPU"` || dataItem.rank === RankUser) && dataItem.tipoSwap === "Swap";
                    } else {
                      // handle error case
                      return false;
                    }
                  });
                  const bgColorSwap = dataMatchSwap ? "#7C10A3" : "white";

                  const dataMatchOffer = data.find((dataItem) => {
                    if (JSON.parse(RankUser) === "JU") {
                      return dataItem.date === cellDate && (dataItem.rank === RankUser || dataItem.rank === `"JUPU"`) && dataItem.tipoSwap === "Offer";
                    } else if (JSON.parse(RankUser) === "JUPU") {
                      return dataItem.date === cellDate && (dataItem.rank === `"JU"` || dataItem.rank === RankUser || dataItem.rank === `"PU"`) && dataItem.tipoSwap === "Offer";
                    } else if (JSON.parse(RankUser) === "PU") {
                      return dataItem.date === cellDate && (dataItem.rank === `"JUPU"` || dataItem.rank === RankUser) && dataItem.tipoSwap === "Offer";
                    } else {
                      // handle error case
                      return false;
                    }
                  });

                  const bgColorOffer = dataMatchOffer ? "green" : "white";


                  const dataMatchAnother = data.find((dataItem) => {
                    if (JSON.parse(RankUser) === "JU") {
                      return dataItem.date === cellDate && (dataItem.rank === RankUser || dataItem.rank === `"JUPU"`) && dataItem.tipoSwap === "Another";
                    } else if (JSON.parse(RankUser) === "JUPU") {
                      return dataItem.date === cellDate && (dataItem.rank === `"JU"` || dataItem.rank === RankUser || dataItem.rank === `"PU"`) && dataItem.tipoSwap === "Another";
                    } else if (JSON.parse(RankUser) === "PU") {
                      return dataItem.date === cellDate && (dataItem.rank === `"JUPU"` || dataItem.rank === RankUser) && dataItem.tipoSwap === "Another";
                    } else {
                      // handle error case
                      return false;
                    }
                  });

                  //  const dataMatchAnother = data.find(
                  //  (dataItem) => dataItem.date === cellDate && dataItem.rank === RankUser && dataItem.tipoSwap === "Another"
                  //);
                  const bgColorAnother = dataMatchAnother ? "#910048" : "white";


                  return (
                    <th key={key + i} className="dia">
                      <div style={{ height: "100%", position: "relative" }}>


                        {dataMatchAnother ? <Link to={`/swap/${cellDate}`}>
                          <div style={{ height: "60%", backgroundColor: bgColorAnother, position: "absolute", bottom: 0, left: 0, right: 0 }} ></div>
                        </Link>
                          : <div style={{ height: "60%", position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                        }

                        {
                          dataMatchOffer ? <Link to={`/swap/${cellDate}`}>

                            <div style={{ height: "40%", backgroundColor: bgColorOffer, position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                          </Link>

                            : <div style={{ height: "40%", backgroundColor: "#f9f9f9", position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                        }
                        {dataMatchSwap ? <Link to={`/swap/${cellDate}`}>

                          <div style={{ height: "20%", backgroundColor: bgColorSwap, position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                        </Link> : <div style={{ height: "20%", backgroundColor: "#f9f9f9", position: "absolute", bottom: 0, left: 0, right: 0 }}></div>}

                        <div>
                          {formattedItem !== 0 && item}

                        </div>
                      </div>
                    </th>

                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mesTexto">
        Map key
      </div>
      <table>
        <tr>
          <td>Swap</td>
          <td style={{ backgroundColor: "#7C10A3", width: "50px" }}></td>
          <td>Offer day Off</td>
          <td style={{ backgroundColor: "Green", width: "50px" }}></td>
          <td>Another Reason</td>
          <td style={{ backgroundColor: "#910048", width: "50px" }}> </td>
        </tr>
      </table>

    </div >
  );
};

export default Test;
