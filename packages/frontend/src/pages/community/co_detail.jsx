import { Container } from "react-bootstrap";
import { AiFillHeart } from "react-icons/ai";
import { Link, NavLink } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteArticle,
  deleteArticleComment,
  postArticleComment,
  setArticleLike,
} from "../../api/article";
import useAlertModal from "../../hook/useAlertModal";
import useArticleDetail from "../../hook/useArticleDetail";
import { useConfirmModal } from "../../hook/useConfirmModal";
import { useLoginId } from "../../hook/useLogin";
import { useLoginInfo } from "../../hook/useLogin";
import { FetchError } from "../../hook/util";
import { formatDate } from "../../util/date";
import Profileimg from "./assets/user.png";
import Comments from "./components/comments";
import ReportButton from "./components/report";
import classes from "./styles/Co_detail.module.css";

export function CommunityDetail() {
  const user_id = useLoginId();
  const navigate = useNavigate();
  const { AlertModal, showAlertModal } = useAlertModal();
  const params = useParams();
  const id = parseInt(params.id);
  const { ConfirmModal, showConfirmModal } = useConfirmModal();
  const { data: article, error } = useArticleDetail(id);
  const userInfo = useLoginInfo();

  const {
    data: fetcherData,
    error: fetcherError,
    isLoading: fetcherIsLoading,
    mutate,
  } = useArticleDetail(id, {
    with_comments: true,
  });

  if (fetcherIsLoading) {
    return <div>로딩중...</div>;
  }
  if (fetcherError) {
    return <div>에러가 발생했습니다.</div>;
  }
  const item = fetcherData;

  const liked = user_id === item.like_user_id;

  if (error) {
    if (error instanceof FetchError && error.info.code === "DELETED") {
      return (
        <Container>
          <div>삭제된 커뮤니티입니다.</div>
        </Container>
      );
    }
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <div>
      <AlertModal />
      <ConfirmModal />
      <div className={classes["container"]}>
        <div className={classes["titleArea"]}>
          <div className={classes["selectedTitle"]}>{item.title}</div>
          <div className={classes["detailbtn"]}>
            {(() => {
              // 비로그인일때
              if (!userInfo) {
                return "";
              }
              // 관리자가 아닐 때
              if (!userInfo.is_admin) {
                return "";
              }
              return (
                <>
                  <Link to={`/community/${item.id}/edit`} state={item}>
                    <button className={classes["editbtn"]}>수정</button>
                  </Link>
                  <button onClick={deleteArticleAction}>삭제</button>
                </>
              );
            })()}
          </div>
          <div>
          </div>
        </div>
        <div className={classes["createdArea"]}>
          <NavLink
            to={`/host-profile/${item.author_id}`}
            className={classes["linkto"]}
          >
            <img src={Profileimg} className={classes["user"]} alt="Profile" />
            <div className={classes["createdBy"]}>{item.author_nickname}</div>
          </NavLink>
          <div className={classes["dateArea"]}>
            <div className={classes["date"]}>{formatDate(item.created_at)}</div>
            <div className={classes["views"]}>조회수: {item.view_count}</div>
          </div>
        </div>
        {item.related_funding_id && (
          <Link
            to={`/fundings/${item.related_funding_id}`}
            className={classes["related_funding_linkto"]}
          >
            <b>펀딩후기</b> | {`${item.related_funding.title}`}
          </Link>
        )}
        <div className={classes["contentArea"]}>
          <p
            // TODO(vi117): sanitize content
            dangerouslySetInnerHTML={{
              __html: item.content,
            }}
          >
          </p>
        </div>
        <div className={classes["reportArea"]}>
          <button
            style={{ marginRight: "7px" }}
            onClick={() => {
              setLike(!liked);
            }}
          >
            <AiFillHeart
              className={classes["Hearticon"]}
              style={{
                width: "24px",
                height: "24px",
                stroke: liked ? "#DF2E38" : "#6d6d6d",
                fill: liked ? "#DF2E38" : "#6d6d6d",
              }}
            />
          </button>
          <ReportButton article_id={article.id} />
        </div>
        <Comments
          comments={item.comments}
          onRegisterComment={registerComment}
          article_id={id}
          onDeleteComment={deleteComment}
        >
        </Comments>
      </div>
    </div>
  );
  async function deleteArticleAction() {
    if (await showConfirmModal("글 삭제", "정말로 삭제하시겠습니까?")) {
      try {
        await deleteArticle(id);
        showAlertModal("글 삭제", "삭제가 완료되었습니다.");
        navigate("/community");
      } catch (e) {
        if (e instanceof Error) {
          showAlertModal("글 삭제", "삭제가 실패했습니다.");
        } else throw e;
      }
    } else {
      return false;
    }
  }
  async function registerComment(c) {
    if (user_id == null) {
      showAlertModal("error", "비회원은 권한이 없습니다. 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const new_comments = await postArticleComment(id, c);
      mutate({
        ...item,
        comments: [...item.comments, {
          content: new_comments.content,
          created_at: new Date().toISOString(),
          user_id,
          id: new_comments.id,
        }],
      });
    } catch (e) {
      if (e instanceof Error) {
        showAlertModal("요청 실패", "요청이 실패했습니다.");
      } else throw e;
    }
  }

  async function deleteComment(comment) {
    try {
      await deleteArticleComment(id, comment.id);
      mutate({
        ...item,
        comments: item.comments.filter((c) => c.id !== comment.id),
      });
    } catch (e) {
      if (e instanceof Error) {
        showAlertModal("요청 실패", "요청이 실패했습니다.");
      } else throw e;
    }
  }

  async function setLike(like = true) {
    if (user_id == null) {
      showAlertModal("error", "비회원은 권한이 없습니다. 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      await setArticleLike(id, like);
      mutate({
        ...item,
        like_user_id: like ? user_id : null,
      });
    } catch (e) {
      if (e instanceof Error) {
        showAlertModal("요청 실패", "요청이 실패했습니다.");
      } else throw e;
    }
  }
}

export default CommunityDetail;
