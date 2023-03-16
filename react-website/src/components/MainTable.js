import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

const MainTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const dbRef = firebase.database().ref('Users');
        dbRef.on('value', (snapshot) => {
            const users = snapshot.val();
            const newData = Object.keys(users).map((key) => {
                const user = users[key];
                return {
                    name: user.name,
                    meetingTime: user.meeting_times['2023-03-17'],
                };
            });
            setData(newData);
        });

        return () => {
            dbRef.off();
        };
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Meeting Time</th>
                </tr>
            </thead>
            <tbody>
                {data.map((user) => (
                    <tr key={user.name}>
                        <td>{user.name}</td>
                        <td>{user.meetingTime}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
