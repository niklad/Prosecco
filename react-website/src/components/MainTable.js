import React, { useEffect, useState } from "react";
import { database } from "./FirebaseConfig";
import { onValue, ref } from "firebase/database";
import GetTodaysDate from "./GetTodaysDate";

function MainTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "Users");

    onValue(usersRef, (snapshot) => {
      const data = [];

      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        data.push(childData);
      });

      setTableData(data);
    });
  }, []);

  const today = GetTodaysDate();

  return (
    <table>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Antalll proseccosetreker</th>
          <th>Dagens møtetid</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((user) => (
          <tr key={user.name}>
            <td>{user.name}</td>
            <td>{user.prosecco_marks}</td>
            <td>{user.meeting_times[today]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MainTable;
