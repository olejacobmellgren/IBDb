import React, {useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import Card from "./CardForBook";
import { DocumentData } from "firebase/firestore";
import "../styles/MyBookLists.css";


const ScrollingMenu = ({ user, listId }: { user: string, listId: string }) => {

  const [books, setBooks] = useState<DocumentData[]>([]);
  const [allLists, setAllLists] = useState<DocumentData[]>([]);



  const userEmail = localStorage.getItem('user')?.replace(/"/g, '');

  useEffect(() => {
    let allBooks: DocumentData[] = [];
    const booksCached = localStorage.getItem("books");
    if (booksCached) {
      allBooks = JSON.parse(booksCached);
      setBooks(allBooks)
    }

    let allCustomLists: DocumentData[] = [];
    const customListsCached = localStorage.getItem("custombooklists");
    if (customListsCached) {
      allCustomLists = JSON.parse(customListsCached);
      setAllLists(allCustomLists);

    }
  }, []);

  const bookIds: string[] = [];
  const name: string = allLists.find((list) => list.listID === listId)?.listname;
  for (const elem in allLists) {
    if (allLists[elem].listID === listId && allLists[elem].userEmail === userEmail) {
      bookIds.push(allLists[elem].bookID);
    }
  }

  let cards: DocumentData[] = [];

  if (bookIds){
    for (const id of bookIds) {
      const book = books.find((book) => book.id === id);
      if (book) {
        cards.push(book);
      }
    }
  }

  return (
    <div>
    {bookIds ? 
      <div>
        <div className="conteiner" id="RATI">
          <div className="header">
            <div className="element"></div>
            <h1>{name}</h1>
          </div>
            <ScrollMenu>
              <div className="scrollingmenu">
                {cards?.map((card) =>
                <div className="custom-card">
                  <div className="remove-button">X </div>
                  <Card
                    title={card.title}
                    bookIMG={card.imgURL}
                    id={card.id}
                    key={card.id} />
                </div>
                )}
              </div>
            </ScrollMenu>
          </div>
        </div>
    : null}
  </div>
  );
}
export default ScrollingMenu;