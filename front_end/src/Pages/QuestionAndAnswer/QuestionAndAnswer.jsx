import  { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from '../../utility/axios.js';
import Layout from "../../Layout/Layout.jsx";
import styles from "./answer.module.css";
import { MdAccountCircle } from "react-icons/md";
import { FaClipboardQuestion } from "react-icons/fa6";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import moment from "moment";
import { UserState } from "../../App.jsx";
import { LuCalendarClock } from "react-icons/lu";
import Swal from "sweetalert2";

function QuestionAndAnswer() {
  const [questionDetails, setQuestionDetails] = useState({});
  const { user } = useContext(UserState);
  const userId = user?.userID;
  const { questionId } = useParams();
  console.log("questionId:", questionId);
  const [loading, setLoading] = useState(true);
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const answerInput = useRef();
  
  // Fetch the question details
  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("EV-Forum-token");
    
    if (token) {
      // Make API request with token in Authorization header
      axiosInstance
        .get(`/question/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`  // Send token in the request header
          }
        })
        .then((res) => {
          setQuestionDetails(res.data.question);
          console.log(res.data);
          setLoading(false); // Set loading false after fetching data
        })
        .catch((error) => {
          // Handle error gracefully if the token is invalid or request fails
          console.error("Error fetching question:", error);
          setLoading(false);
          if (error.response && error.response.status === 401) {
            Swal.fire({
              title: "Unauthorized",
              text: "Your session has expired. Please log in again.",
              icon: "warning",
              confirmButtonText: "OK",
            }).then(() => {
              // Redirect to login page or handle token expiration
              window.location.href = "/login";
            });
          }
        });
    } else {
      setLoading(false);
      // If token is not available, handle the scenario (e.g., redirect to login)
      window.location.href = "/login";
    }
  }, [questionId]);

  // Post a new answer to the question
async function handlePostAnswer(e) {
    e.preventDefault();
    const answer = answerInput.current.value;
    const questionID = questionId;
    const userID = userId;
    console.log(questionId)
    console.log(userId)
    console.log(answerInput.current.value)
      
    const response = await axiosInstance.post("/giveAnswer", {
      questionID,
      userID,
      answer
      });
    
      try {
        const response = await axiosInstance.post("/giveAnswer", {
          questionID: questionId,
          userID: userId,
          answer: answerInput.current.value,
        });
      
        if (response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Answer submitted successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to post answer",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (Error) {
        console.error("Error posting answer:", Error);  // Log the error to console
        Swal.fire({
          title: "Error",
          text: "Failed to post answer. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      
    }
  
  
  

  // Function to truncate text after 100 words
  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > limit) {
      return (
        <>
          {words.slice(0, limit).join(" ")}{" "}
          <span
            style={{
              color: "var(--blue-shade)",
              cursor: "pointer",
            }}
            onClick={() => toggleExpandAnswer(null)} // Function will handle the expansion/collapse
          >
            ... See More
          </span>
        </>
      );
    }
    return text;
  };

  // Toggle expand/collapse for the answer
  const toggleExpandAnswer = (answerId) => {
    if (expandedAnswer === answerId) {
      setExpandedAnswer(null); // Collapse the answer
    } else {
      setExpandedAnswer(answerId); // Expand the answer
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div style={{ display: "flex" }}>
            <div>
              <FaClipboardQuestion size={35} style={{ marginRight: "10px" }} />
            </div>
            <div>
              <h1 className={styles.title}>Question</h1>
              <p className={styles.questionDescription}>
                {questionDetails?.content}
              </p>
              <p className={styles.question_date}>
              Asked by: 
                <span style={{fontWeight: "600"}}> { questionDetails.question_username }</span> <br />
                <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
                {moment(questionDetails.created_at)
                  .format("ddd, MMM DD, YYYY h:mm A")
                  .toUpperCase()}
              </p>
            </div>
          </div>
<hr/>
          <h2
            style={{ padding: "5px 0", textAlign: "left", fontWeight: "600" }}
          >
            <MdOutlineQuestionAnswer
              size={35}
              style={{ marginRight: "10px" }}
            />
            Answers From the Community:
          </h2>
<hr/>
          {/* Display answers */}
          {questionDetails?.answers?.length > 0 ? (
            questionDetails?.answers?.map((answer) => (
              <div key={answer?.answer_id} className={styles.answer_holder}>
                <div className={styles.account_holder}>
                  <MdAccountCircle size={50} />
                  <div className={styles.profileName}>{answer?.answer_username}</div>
                </div>
                <div
                  className={styles.answerTextContainer}
                  onClick={() => toggleExpandAnswer(answer?.answer_id)} // Click on the whole container
                >
                  <p className={styles.answerText}>
                    {expandedAnswer === answer?.answer_id
                      ? answer?.answer
                      : truncateText(answer?.answer)}
                  </p>
                  <p className={styles.answer_date}>
                    <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
                    {moment(answer?.created_at)
                      .format("ddd, MMM DD, YYYY h:mm A")
                      .toUpperCase()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>
              <span style={{ color: "red", fontWeight: "bold" }}>
                No answers yet!
              </span>{" "}
              <br /> Be the first to contribute your answer and help the
              community.
            </p>
          )}

          {/* Form to submit a new answer */}
          <section className={styles.answerFormSection}>
            <h3 className={styles.answerFormTitle}>Answer The Top Question</h3>
            <Link to="/" className={styles.questionPageLink}>
              Go to Question page
            </Link>
            <form onSubmit={handlePostAnswer}>
              <textarea
                placeholder="Your Answer..."
                className={styles.answerInput}
                required
                ref={answerInput}
              />
              <button className={styles.postAnswerButton} type="submit">
                Post Your Answer
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default QuestionAndAnswer;
