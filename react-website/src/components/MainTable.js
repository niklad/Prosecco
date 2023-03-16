import React, { useEffect, useState } from "react";
import { database } from "./FirebaseConfig";
import { onValue, ref } from "firebase/database";
import GetTodaysDate from "./GetTodaysDate";
import GetTomorrowsDate from "./GetTomorrowsDate";
import GetUserStatus from "./GetUserStatus"
import GetUserMeetingTime from "./GetUserMeetingTime"

import '../styles/MainTable.css';


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
            data.sort((a, b) => b.prosecco_marks - a.prosecco_marks); // Sort by "Antall streker"
            setTableData(data);
        });
    }, []);

    const dateToday = GetTodaysDate();
    const dateTomorrow = GetTomorrowsDate();

    return (
        <table>
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>Antall streker</th>
                    <th>Dagens møtetid</th>
                    <th>Morgendagens møtetid</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((user) => (
                    <tr key={user.name}>
                        <td>{user.name}</td>
                        <td>{user.prosecco_marks}</td>
                        <td>{GetUserMeetingTime(user, dateToday)}</td>
                        <td>{GetUserMeetingTime(user, dateTomorrow)}</td>
                        <td>{GetUserStatus(user, dateToday)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default MainTable;
