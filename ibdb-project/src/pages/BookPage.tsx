import React, { MouseEventHandler } from "react";
import firebaseControl from "../firebaseControl";
import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { StarRating } from "star-rating-react-ts";
import "../styles/BookPage.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const BookPage = () => {
  const { id } = useParams();
  const bookID = typeof id === "string" ? id : "";
  const userEmail = localStorage.getItem("user")?.replace(/"/g, "");
  const firebaseController = new firebaseControl();

  const [reviews, setReviews] = useState<DocumentData[]>([]);
  const [userReview, setUserReview] = useState<DocumentData>();
  const [reviewToDelete, setReviewToDelete] = useState<DocumentData>([]);
  const [book, setBook] = useState<any>();
  const [rating, setRating] = useState<number>(0);
  const [amountOfRatingsForBook, setAmountOfRatingsForBook] =
    useState<number>(0);
  const [reviewAdded, setReviewAdded] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean>(false);
  const [hideReviewToDelete, setHideReviewToDelete] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [visibleReviewPopup, setVisibleReviewPopup] = useState(false);
  const [visibleDeletePopup, setVisibleDeletePopup] = useState(false);
  const [visibleAddBookToListPopup, setVisibleAddBookToListPopup] =
    useState(false);
  const [removeBookFromList, setRemoveBookFromList] = useState(false);
  const [visibleRemoveBookFromListPopup, setVisibleRemoveBookFromListPopup] =
    useState(false);
  const [commentText, setCommentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [allCustomLists, setAllCustomLists] = useState<DocumentData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [addExistingOrNew, setAddExistingOrNew] = useState("existing");

  useEffect(() => {

    let allBooks: DocumentData[] = [];
    const booksCached = localStorage.getItem("books");
    if (booksCached) {
      allBooks = JSON.parse(booksCached);
    }
    const book = allBooks.find((book) => book.id === bookID);
    setBook(book);

    let allReviews: DocumentData[] = [];
    let thisBookReviews: DocumentData[] = [];
    const reviewsCached = localStorage.getItem("reviews");
    if (reviewsCached) {
        allReviews = JSON.parse(reviewsCached);
        thisBookReviews = allReviews.filter((review) => review.bookID === bookID);
    }
    setReviews(thisBookReviews);
    var counter = 0;

    thisBookReviews.forEach(review => {
        counter++;

        if (review.userID === userEmail) {
            setAlreadyReviewed(true);
            setUserReview(review);
        }
    });
    setAmountOfRatingsForBook(counter);


    if (userEmail === "admin@gmail.com"){
      setIsAdmin(true);
    }

    let allCustomLists: DocumentData[] = [];
    const customListsCached = localStorage.getItem("custombooklists");
    if (customListsCached) {
      allCustomLists = JSON.parse(customListsCached);
      setAllCustomLists(allCustomLists);
    }

    for (const elem in allCustomLists) {
      if (allCustomLists[elem].bookID === bookID && allCustomLists[elem].userEmail === userEmail) {
        setRemoveBookFromList(true);
      }
    }
    
  }, [bookID, userEmail]);

  const listNames: string[] = [];
  const listNamesThisBook: string[] = [];

  for (const elem in allCustomLists) {
    if (!listNames.includes(allCustomLists[elem].listname) && allCustomLists[elem].userEmail === userEmail) {
      listNames.push(allCustomLists[elem].listname)
    }
  }

  for (const elem in allCustomLists) {
    if (!listNamesThisBook.includes(allCustomLists[elem].listname) && allCustomLists[elem].userEmail === userEmail && allCustomLists[elem].bookID === bookID) {
      listNamesThisBook.push(allCustomLists[elem].listname)
    }
  }

  
  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const maxChars = 250;
  const displayText = showFullText
    ? book?.description
    : book?.description.slice(0, maxChars) + "...";

  //Kode for når tekstboksen skrives i (passer på at den ekspanderer ettersom man skriver)
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  function handleCommentSubmit() {
    if (userEmail) {
      if (userReview) {
        firebaseController.deleteReview(userReview);
      }
      const review: DocumentData = {
        bookID: bookID,
        comment: commentText,
        rating: rating,
        userID: userEmail,
      };
      firebaseController.addReview(review);
      setUserReview(review);
      setVisibleReviewPopup(false);
      setAlreadyReviewed(false);
      setReviewAdded(true);
    }
  }

  const handleRateBook = () => {
    if (!userEmail) {
        setErrorMessage("You need to be logged in to rate books and add books to lists");
    } else if (book?.releaseYear > 2023) {
        setErrorMessage("You can't rate a book before it is released")
    } else {
        setVisibleReviewPopup(true);
    }
  };

  const handleEdit = () => {
    setCommentText(userReview?.comment);
    setRating(userReview?.rating);
    setVisibleReviewPopup(true);
  };

  const closeOrOpen: MouseEventHandler<HTMLDivElement> = (e) => {
    const isClose = (e.target as HTMLElement).closest("#popup");
    if (!isClose) {
      setVisibleReviewPopup(false);
    }
  };

  const closeOrOpenAddBookToList: MouseEventHandler<HTMLDivElement> = (e) => {
    const isClose = (e.target as HTMLElement).closest("#popup");
    if (!isClose) {
      setVisibleAddBookToListPopup(false);
    }
  };

  const closeOrOpenRemoveBookFromList: MouseEventHandler<HTMLDivElement> = (e) => {
    const isClose = (e.target as HTMLElement).closest("#popup");
    if (!isClose) {
      setVisibleRemoveBookFromListPopup(false);
    }
  };

  const deleteReview = (review: DocumentData) => {
    setVisibleDeletePopup(true);
    setReviewToDelete(review);
  };

  const handleConfirm = () => {
    firebaseController.deleteReview(reviewToDelete);
    setVisibleDeletePopup(false);
    setVisibleReviewPopup(false);
    setAlreadyReviewed(false);
    setReviewAdded(false);
    setHideReviewToDelete(true);
    setCommentText("");
    setRating(0);
  };

  const handleAddBookToList = () => {
    if (addExistingOrNew === 'existing') {
      const selectElement = document.getElementById('list-select') as HTMLSelectElement;
      const selectedList = selectElement.value;
      for (const elem in allCustomLists) {
        if (allCustomLists[elem].listname === selectedList && allCustomLists[elem].bookID === bookID) {
          setErrorMessage("This book already exists in this list");
          return;
        }
      }
      firebaseController.addBookToList(selectedList, bookID)
    } else if (addExistingOrNew === 'new') {
      const inputElement = document.getElementById('list-name') as HTMLInputElement;
      const inputedList = inputElement.value;
      firebaseController.addBookToList(inputedList, bookID)
    }
    setVisibleAddBookToListPopup(false);
  }

  const handleRemoveBookFromList = () => {
    const selectElement = document.getElementById('list-select-delete') as HTMLInputElement;
    const selectedList = selectElement.value;
    firebaseController.removeBookFromList(selectedList, bookID)
    setVisibleRemoveBookFromListPopup(false);
  }

  return (
    <div className="inline-flex">
      <div className="left">
        <img className="center image" src={book?.imgURL} alt={book?.imgURL} />
        {!isAdmin ? (
          <div>
            <button onClick={() => {setVisibleAddBookToListPopup(true)}} className="add-book-to-list mt-5 px-6 py-3 rounded-xl bg-hvit shadow-0 hover:shadow-lg">
              Add book to list
            </button>
          </div>
        ) : null}
        {removeBookFromList ? (
          <div>
            <button onClick={() => {setVisibleRemoveBookFromListPopup(true)}} className="remove-book-from-list px-6 py-3 rounded-xl bg-kulTheme shadow-0 hover:shadow-lg">
              Remove book from list
            </button>
          </div>
        ) : null}
        <div className="center starRating">
          <div className="bottom w-full flex flex-col items-center justify-between overflow-y-auto">
            {visibleAddBookToListPopup ? (
              <div className="popupBackground" onClick={closeOrOpenAddBookToList}>
                <div className="popup-inner" id="popup">
                  <div className="top">
                    <div className="add-book-list-or-new-flex">
                      <button
                        className={
                          addExistingOrNew=== "existing" ? "normal" : "grey-text"
                        }
                        onClick={() => setAddExistingOrNew("existing")}
                      >
                        Add to existing list
                      </button>
                      <div
                        className={
                          addExistingOrNew === "existing" ? "existing-underline" : ""
                        }
                      ></div>
                    </div>
                    <div className="add-book-list-or-new-flex">
                      <button
                        className={
                          addExistingOrNew === "new" ? "normal" : "grey-text"
                        }
                        onClick={() => setAddExistingOrNew("new")}
                      >
                        Add to new list
                      </button>
                      <div
                        className={
                          addExistingOrNew === "new" ? "new-underline" : ""
                        }
                      ></div>
                    </div>
                  </div>
                  {addExistingOrNew === "existing" ? (
                    <div>
                      {errorMessage !== "" ? (
                        <p className="error">{errorMessage}</p>
                      ) : null}
                      <div>
                        <select id='list-select' name='list' className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0">
                            {listNames.map(listName => (
                                <option key={listName} value={listName}>{listName}</option>
                                ))}
                        </select>
                        <button className="list-popup-button shadow-0" onClick={()=> handleAddBookToList()}>
                          Add to list
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        className="input shadow-0"
                        id="list-name"
                        placeholder="Name of list"
                        // onKeyDown={handleEnterSignUp}
                        // value={confirmPassword}
                        // onChange={(e) => {
                        //   setConfirmPassword(e.target.value);
                        // }}
                      />
                      {errorMessage !== "" ? (
                        <p className="error">{errorMessage}</p>
                      ) : null}
                      <div >
                        <button className="list-popup-button shadow-0" onClick={()=> handleAddBookToList()}>
                          Add to new list
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {visibleRemoveBookFromListPopup ? (
              <div className="popupBackground" onClick={closeOrOpenRemoveBookFromList}>
                <div className="popup-inner" id="popup">
                  <div>
                    <select id='list-select-delete' name='list' className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0">
                        {listNamesThisBook.map(listNameDelete => (
                            <option key={listNameDelete} value={listNameDelete}>{listNameDelete}</option>
                            ))}
                    </select>
                    <button className="list-popup-button shadow-0" onClick={()=> handleRemoveBookFromList()}>
                      Remove from list
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {visibleReviewPopup ? (
              <div>
                <div className="popup" onClick={closeOrOpen}>
                  <div className="popup-inner" id="popup">
                    <StarRating
                      initialRating={rating}
                      onClick={(rating) => {
                        setRating(rating);
                      }}
                    />

                    <textarea
                      className="text-area px-3 py-3 top mt-4 rounded-lg bg-hvit shadow-0 items-center  text-lg"
                      value={commentText}
                      onChange={handleCommentChange}
                      placeholder="Add a review to your rating"
                      cols={28}
                      style={{ height: "auto", minHeight: "100px" }}
                    />
                    <div className="flex">
                      {commentText === "" ? (
                        <button
                          onClick={() => handleCommentSubmit()}
                          className="button text-base mt-2 mr-10 px-5 py-1 rounded-lg bg-hvit shadow-0 hover:shadow-lg"
                        >
                          Submit without comment
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCommentSubmit()}
                          className="button text-base mt-2 mr-10 px-5 py-1 rounded-lg bg-hvit shadow-0 hover:shadow-lg"
                        >
                          Submit with comment
                        </button>
                      )}
                      {userReview ? (
                        <button
                          onClick={() => deleteReview(userReview)}
                          className="text-base mt-2 px-5 py-1 rounded-lg bg-kulTheme shadow-0 hover:shadow-lg"
                        >
                          Delete review
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div id="reviewSection">
            <p id="info"></p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="title">
          <p className="text-4xl">{book?.title}</p>
        </div>
        <div className="author">
          <p>{book?.author}</p>
        </div>
        <div className="flex items-center">
          <ul className="rating flex items-center">
            <li className="rating">
              {book && (
                <StarRating readOnly={true} initialRating={book?.rating} />
              )}
            </li>
            <li className="rating ml-5">{book?.rating} / 5</li>
          </ul>
          {amountOfRatingsForBook === 1 ? (
            <div className="amountOfRatings text-sm ml-10 mt-3">
              {amountOfRatingsForBook} rating
            </div>
          ) : (
            <div className="amountOfRatings text-sm ml-10 mt-3">
              {amountOfRatingsForBook} ratings
            </div>
          )}
        </div>

        <div className="center" id="description">
          <p>{displayText}</p>
          <button
            className="genre italic inline-flex"
            onClick={toggleShowFullText}
          >
            {showFullText ? (
              <p className="flex items-center mb-2 mt-2">
                Show less <UpOutlined className="ml-2 mt-1" />
              </p>
            ) : (
              <p className="flex items-center mb-2 mt-2">
                Show more <DownOutlined className="ml-2 mt-1" />{" "}
              </p>
            )}
          </button>
        </div>
        <ul className="info">
          <li className="info">
            Genre: &emsp; &emsp; &emsp; &ensp; &nbsp; {book?.genre}
          </li>
          <li className="info">
            Release Year: &emsp; &nbsp; &nbsp; {book?.releaseYear}
          </li>
        </ul>
        {alreadyReviewed ? (
          <div className="commentBox">
            <p>
              {" "}
              Your review{" "}
              <u
                className="edit-underline"
                onClick={() => {
                  handleEdit();
                }}
              >
                {" "}
                edit{" "}
              </u>{" "}
            </p>
            <StarRating
              theme={{ size: 30 }}
              readOnly={true}
              initialRating={userReview?.rating}
            />
            <p>{userReview?.comment}</p>
          </div>
        ) : (
          <div>
            {!reviewAdded && !isAdmin ? (
              <button
                className="rate-book mt-5 px-6 py-3 rounded-xl bg-hvit shadow-0 hover:shadow-lg"
                onClick={() => handleRateBook()}
              >
                Rate this book
              </button>
            ) : null}
            <p className="error-message">{errorMessage}</p>
          </div>
        )}

        {reviewAdded ? (
          <div>
            <p>
              {" "}
              Your review{" "}
              <u
                className="edit-underline"
                onClick={() => {
                  handleEdit();
                }}
              >
                {" "}
                edit{" "}
              </u>{" "}
            </p>
            <StarRating
              theme={{ size: 30 }}
              readOnly={true}
              initialRating={rating}
            />
            <p>{userReview?.comment}</p>
          </div>
        ) : null}
        {visibleDeletePopup ? (
          <div>
            <div className="popup" onClick={closeOrOpen}>
              <div className="popup-inner" id="popup">
                <p>Are you sure you want to delete this review? </p>
                <button
                  onClick={() => handleConfirm()}
                  className="button text-base mt-2 px-5 py-1 rounded-lg bg-hvit shadow-0 hover:shadow-lg"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setVisibleDeletePopup(false)}
                  className="button text-base mt-2 px-5 py-1 rounded-lg bg-hvit shadow-0 hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="reviewSection">
          {amountOfRatingsForBook === 0 ? (
            <p>There are currently no reviews for this book</p>
          ) : (
            <p>Reviews</p>
          )}
          {reviews.map((review) => (
            <div>
              {review.userID !== userEmail ? (
                <div className="commentBox">
                  <StarRating
                    theme={{ size: 30 }}
                    readOnly={true}
                    initialRating={review.rating}
                  />
                  <p>{review.comment}</p>
                  <div className="inline-flex">
                    <p className="genre mr-1">Reviewed by</p>
                    <p className="genre italic">
                      {" "}
                      {review.userID.split("@")[0]}
                    </p>
                  </div>
                </div>
              ) : null}
              <div>
                {userEmail === "admin@gmail.com" &&
                review.userID !== "admin@gmail.com" &&
                !hideReviewToDelete ? (
                  <button
                    className="px-6 py-3 rounded-xl bg-kulTheme shadow-0 hover:shadow-lg"
                    onClick={() => deleteReview(review)}
                  >
                    {" "}
                    Delete Review{" "}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
