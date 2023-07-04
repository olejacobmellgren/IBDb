import React from 'react'
import ScrollingMenuCustom from '../components/ScrollingMenuCustom';
import { DocumentData } from 'firebase/firestore';


const MyBookLists = () => {

    var userEmail = localStorage.getItem('user')?.replace(/"/g, '');
    if (userEmail === undefined) {
        userEmail = "";
    }

    const customListsCached = localStorage.getItem("custombooklists");
    let allCustomLists: DocumentData[] = [];

    if (customListsCached) {
        allCustomLists = JSON.parse(customListsCached);
    }

    const listNames: string[] = [];
    for (const elem in allCustomLists) {
        if (!listNames.includes(allCustomLists[elem].listname) && allCustomLists[elem].userEmail === userEmail) {
            listNames.push(allCustomLists[elem].listname)
        }
    }
    console.log(listNames);

    return (
        <div>
            {listNames.map((listName, i) => (
                <div key={i} className="custom-list">
                    <ScrollingMenuCustom user={userEmail || ""} listId={(i+1).toString()} />
                </div>
            ))}
        </div>
    )
}

export default MyBookLists;