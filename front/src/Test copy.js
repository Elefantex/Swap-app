import React, { useEffect, useState } from "react";
import { calendario } from "./Calendario";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGetSwapsQuery } from "./app/apiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Test.css";
import { fetchSwaps } from "./app/slices";

const Testcopy = (props) => {
  const dispatch = useDispatch()
  const fecha = new Date();
  const navigate = useNavigate()

  const [mes, setMes] = useState(fecha.getMonth());

  const [array, setArray] = useState([]);
  const [filas, setFilas] = useState([]);

  const [prueba, setPrueba] = useState([]);

  const id = JSON.parse(localStorage.getItem('IDUserLogin'));
  useEffect(() => {
    if (!id) {
      navigate("/login")
    }
  }, [])


  const [open, setOpen] = useState(false);
  const color = "azul"
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([])
  const { data: swapData = [] } = useGetSwapsQuery()
  const roster = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]



  useEffect(() => {
    const getSwaps = async () => {
      const response = await dispatch(fetchSwaps());
      setData(response.payload);
      setOriginalData(swapData)
    };
    getSwaps();
  }, [dispatch, swapData, setData, setOriginalData])


  //useEffect(() => {
  //   setData(swapData);
  //  setOriginalData(swapData)
  //}, [swapData, setData, setOriginalData]);



  useEffect(() => {
    crearMes();
  }, [mes, data]);
  console.log(swapData)



  const crearMes = () => {
    const matches = data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === calendario[mes].year &&
        itemDate.getMonth() === calendario[mes].month &&
        itemDate.getDate() >= 1 &&
        itemDate.getDate() <= calendario[mes].dias
      );
    });

    for (let index = 0; index < calendario[mes].empieza; index++) {
      array.push(" ");
    }

    for (let index = 1; index <= calendario[mes].dias; index++) {
      array.push(index);
    }

    for (let index = 0; index < array.length; index += 7) {
      const chunk = array.slice(index, index + 7);
      filas.push(chunk);
    }

    setPrueba(filas);
    setFilas([]);
    setArray([]);
  };

  const filterRoster = () => {
    const checkboxes = document.getElementsByName('roster');
    const checkedValues = [];

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkedValues.push(checkboxes[i].value);
      }
    }

    if (checkedValues.length === 0) {
      // If no checkboxes are checked, assume the user wants to select all options
      setData(originalData);
      return;
    }

    const newDataFilterRoster = originalData.filter((dataRoster) => {
      return checkedValues.includes(dataRoster.roster);
    });

    setData(newDataFilterRoster);
    console.log(newDataFilterRoster);
  }


console.log(prueba)
console.log(Object.keys(prueba))


  return (
    <div className="calendario">

      <div className="mes">
        <div className="">
          <button className="botonIzq"
            disabled={mes > 0 ? false : true}

            sx={{
              color: "#1083D6",
            }}
            onClick={() => {
              setMes(mes - 1);
            }}
          >Menos
          </button>
        </div>
        <div className="mesTexto"> {calendario[mes].nombre}</div>
        <div className="">
          <button
            className="botonDer"
            disabled={mes < 11 ? false : true}
            sx={{
              color: "#1083D6",
            }}
            onClick={() => {
              setMes(mes + 1);
            }}
          >Más
          </button>
        </div>
      </div>
      <div>Select roster:


        {roster.map((item) => {
          return (
            <>
              <label>{item}
                <input type="checkbox" name="roster" id="roster-`${item}`" onChange={filterRoster} value={item} />
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
                  const cellDate = `${calendario[mes].year}-${calendario[mes].month}-${formattedItem}`;
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
                  const bgColorSwap = dataMatchSwap ? "blue" : "white";

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
                  const bgColorAnother = dataMatchAnother ? "red" : "white";


                  return (
                    <th key={key + i} className="dia">
                      <div style={{ height: "100%", position: "relative" }}>


                        {dataMatchAnother ? <Link to={`/swap/${cellDate}`}>
                          <div style={{ height: "60%", backgroundColor: bgColorAnother, position: "absolute", bottom: 0, left: 0, right: 0 }} onClick={() => console.log(item)}></div>
                        </Link>
                          : <div style={{ height: "60%", backgroundColor: "white", position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                        }

                        {
                          dataMatchOffer ? <Link to={`/swap/${cellDate}`}>

                            <div style={{ height: "40%", backgroundColor: bgColorOffer, position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                          </Link>

                            : <div style={{ height: "40%", backgroundColor: "white", position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                        }
                        {dataMatchSwap ? <Link to={`/swap/${cellDate}`}>

                          <div style={{ height: "20%", backgroundColor: bgColorSwap, position: "absolute", bottom: 0, left: 0, right: 0 }}></div>
                        </Link> : <div style={{ height: "20%", backgroundColor: "white", position: "absolute", bottom: 0, left: 0, right: 0 }}></div>}


                        {formattedItem !== 0 && item}
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
          <td style={{ backgroundColor: "Blue", width: "50px" }}></td>
          <td>Offer day Off</td>
          <td style={{ backgroundColor: "Green", width: "50px" }}></td>
          <td>Another Reason</td>
          <td style={{ backgroundColor: "Red", width: "50px" }}> </td>
        </tr>
      </table>
    </div >
  );
};

export default Testcopy;