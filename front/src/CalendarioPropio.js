import React, { useEffect, useState } from "react";
import "./Test.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import PuffLoader from "react-spinners/ClipLoader";
import { getNotes } from "./app/slices";




const CalendarioPropio = () => {
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

  let [color, setColor] = useState("#000000");


  useEffect(() => {
    const getSwapsFromDatabase = async () => {
      try {
        setIsLoading(true);
        const swaps = await getNotes();
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

  console.log(data)


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


  const colors = ["#A33421", "#7DA329", "#08A361", "#A3185C", "#7C10A3"];
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

                  const dataMatchInfo = data.filter((dataItem) => dataItem.date === cellDate && dataItem.userId === id[0])

                  return (
                    <th key={key + i} className="dia">

                      <div style={{ height: "100%", position: "relative" }}>
                        <div>
                          {formattedItem !== 0 && item}
                        </div>

                        {dataMatchInfo.length > 0 ? (
                          <div style={{ height: "60%" }}>
                            {dataMatchInfo.slice(0, 3).map((item, index) => (
                              <div key={index}>
                                <Link to={`/note/${cellDate}`}>
                                  <div
                                    style={{
                                      height: `${(60 / dataMatchInfo.length)}%`,
                                      backgroundColor: colors[index % colors.length],
                                      position: "absolute",
                                      bottom: `${index * (60 / dataMatchInfo.length)}%`,
                                      left: 0,
                                      right: 0,
                                      fontSize: "0.8em",
                                      textAlign: "center",
                                    }}
                                  >
                                    {item.crewcode}
                                  </div>
                                </Link>
                              </div>
                            ))}
                            {dataMatchInfo.length > 3 ? (
                              <Link to={`/note/${cellDate}`}>

                                <div key={dataMatchInfo.length} style={{
                                  height: `${(60 / dataMatchInfo.length)}%`,
                                  backgroundColor: colors[3 % colors.length],
                                  position: "absolute",
                                  bottom: `${(dataMatchInfo.length - 1) * (60 / dataMatchInfo.length)}%`,
                                  left: 0,
                                  right: 0,
                                  fontSize: "0.8em",
                                  textAlign: "center",
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  whiteSpace: "nowrap"
                                }}>
                                  <div>{'+'}</div>

                                </div>
                              </Link>

                            ) : null}
                          </div>
                        ) : (
                          <Link to={`/createnote`} state={{ dateFrom: cellDate }}>

                            <div
                              style={{
                                height: `60%`,
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                fontSize: "0.8em",
                                textAlign: "center",
                              }}>

                            </div>

                          </Link>
                        )}



                      </div>

                    </th>

                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

    </div >
  );
};

export default CalendarioPropio;