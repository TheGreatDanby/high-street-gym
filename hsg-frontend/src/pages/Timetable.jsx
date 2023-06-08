import Classes from "../components/Classes";
import { useEffect, useState } from "react";
import { getAllClasses } from "../api/classes";

function Timetable() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    getAllClasses().then((getClassesResponse) => {
      setClasses(getClassesResponse);
    });
  }, []);

  return (
    <div>
      <div className="grid grid-flow-col  m-10">
        {classes.map((classObj, index) => (
          <div className="" key={`${classObj.ID}-${index}`}>
            <a href={`#${classObj.Name}`}>
              <button className="btn btn-info text-white">
                {classObj.Name}
              </button>
            </a>
          </div>
        ))}
      </div>
      <Classes />
    </div>
  );
}

export default Timetable;
