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

    const listIDs: string[] = [];
    for (const elem in allCustomLists) {
        if (!listIDs.includes(allCustomLists[elem].listID) && allCustomLists[elem].userEmail === userEmail) {
            listIDs.push(allCustomLists[elem].listID)
        }
    }

    return (
        <div>
            {listIDs.map((list) => (
                <div key={list} className="custom-list">
                    <ScrollingMenuCustom user={userEmail || ""} listId={list} />
                </div>
            ))}
        </div>
    )
}

export default MyBookLists;