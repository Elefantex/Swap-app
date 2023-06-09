import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/ClipLoader";
import "./Test.css";
import { getSwaps } from "./app/slices";





const Calendario = () => {
  const fecha = new Date();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mes, setMes] = useState(fecha.getMonth());
  const [anio, setAnio] = useState(fecha.getFullYear());
  const [prueba, setPrueba] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const id = JSON.parse(localStorage.getItem('IDUserLogin'));

  const rosterId = JSON.parse(localStorage.getItem("Roster"))
  console.log(rosterId)

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
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false);

  };

  return (
    <div className="calendario">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"How this works?"}
        </DialogTitle>
        <DialogContent>
          <div id="alert-dialog-description">
            This calendar is use for people to offer their swaps and try to change their duties with each other, depending on your rank:
            <div>
              JU can see JU and JUPU.
            </div>
            <div>
              JUPU can see JU, JUPU and PU
            </div>
            <div>
              PU can see JUPU and PU
            </div>
            By clicking on the day at the calendar will show you the different offers of swaps for that day. If you want to create a swap for that day it will give you the option by clicking on “Create Swap”.
            <div>
              In the top of the screen you can filter by roster number, if not all rosters will appear.
            </div>
            <div>
              You have useful information at the bottom of the screen to understand the colours:
            </div>
            <div><b>Swap</b> requesting swap to change your duty </div>
            <div><b>Offer day off</b> Offering your day off for a new duty
            </div>
            <div><b>Another Reason</b> Looking for a short duty or anything else that suits you better than your actual duty</div>
            <div>
              You can access to all of this information about requested swaps in your profile.
            </div>

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}
            color="success"
            variant="contained"
          >Continue</Button>
        </DialogActions>
      </Dialog>
      <div className="mes">
        <div className="pruebaCalendario">
          <BiInfoCircle size={28} onClick={() => setOpen(true)} />
        </div>
        <div className="pruebaCalendarioNoText">
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
              <label className="" style={{ margin: "10px" }}>

                <b>{item}</b>

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
                        <div>

                          {formattedItem !== 0 && item}

                        </div>


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
                        {dataMatchOffer || dataMatchAnother || dataMatchSwap ? <div></div> : <div
                        >
                          <Link to={`/create`} state={{ dateFrom: cellDate }}
                            style={{
                              height: `100%`,
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,

                            }}
                          >
                          </Link></div>}


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

export default Calendario;
