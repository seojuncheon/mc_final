import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Carousel,
  Container,
  Dropdown,
  DropdownButton,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import useFundingDetail from "../../hook/useFundingDetail";
import { useLoginId } from "../../hook/useLogin";
import classes from "./FundingsDetail.module.css";

const placeholder = "https://via.placeholder.com/850x375";

const fundings = [
  {
    id: 1,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: 1000,
    current_value: 500,
  },
  {
    id: 2,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 3,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 4,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 5,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 6,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
  {
    id: 7,
    title: "funding 1",
    thumbnail: placeholder,
    tag: "고양이",
    content: "aaaaaaaaaaaaaaaa",
    target_value: "1000",
    current_value: "500",
  },
];

const FundingsDetail = function() {
  const { id } = useParams();
  const { data: funding, error, isLoading, mutate } = useFundingDetail(id);

  const user_id = useLoginId();
  const [selectedReward, setSelectedReward] = useState(null);
  useEffect(() => {
    if (isLoading) return;
    if (error) return;
    if (funding.participated_reward_id === null) return;
    const reward = funding.rewards.filter((r) =>
      r.id === funding.participated_reward_id
    )[0];
    setSelectedReward(reward);
  }, [isLoading, error, funding?.participated_reward_id, funding?.rewards]);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  if (isLoading) {
    // TODO(vi117): sippner 대신 Bootstrap.Placeholder 띄우기.
    return <Spinner />;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  const content_thumbnails = funding.content_thumbnails.length > 0
    ? funding.content_thumbnails
    : [funding.thumbnail];
  return (
    <Container
      style={{ paddingTop: "20px", "maxWidth": "var(--max-content-width)" }}
    >
      <div className={classes.sujung}>
        {user_id === funding.host_id && (
          <NavLink to={`/fundings/${id}/edit`}>
            <Button variant="success">수정</Button>
          </NavLink>
        )}
      </div>
      <Row>
        <Col sm={8} className={classes.fundingName}>
          <h1>{funding.title}</h1>
        </Col>
        <Col className={classes.tags}>
          {funding.tags.map((tag) => <Badge key={tag.id}>{tag.tag}</Badge>)}
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <Carousel slide={false}>
            {content_thumbnails.map((thumbnail) => (
              <Carousel.Item key={thumbnail}>
                <img src={thumbnail} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        {/* TODO(vi117): 예쁘게 날짜 출력 */}
        <Col
          style={{
            fontSize: "14px",
          }}
        >
          <Row>
            <Col sm={4}>
              펀딩기간
            </Col>
            <Col sm={8}>
              {formatDate(new Date(funding.begin_date))} ~{" "}
              {formatDate(new Date(funding.end_date))}
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              달성도
            </Col>
            <Col sm={8}>
              {funding.current_value}원 / {funding.target_value}원
            </Col>
          </Row>
          {
            /* <Row>
            <Col sm={4}>
              참여자수
            </Col>
            <Col sm={8}>
              {funding.rewards.map((reward) => <div key={reward.id}>{reward.reward_current_count}</div>)}
            </Col>
          </Row>
          총 인원을 어떻게 가져와야할지 몰라서 주석처리. 나중에 추가하면 좋을듯 */
          }
          {
            /* <div style={{}}>
            </div> */
          }
          <hr />

          <Row>
            <div>{funding.host_nickname}</div>
          </Row>
          <Row style={{ "padding": "10px 0px 10px 0px" }}>
            <Col className="sns">
              <ButtonGroup vertical>
                <DropdownButton
                  as={ButtonGroup}
                  title="공유하기💌"
                  id="bg-vertical-dropdown-1"
                >
                  <Dropdown.Item eventKey="1">인스타</Dropdown.Item>
                  <Dropdown.Item eventKey="2">네이버블로그</Dropdown.Item>
                  <Dropdown.Item eventKey="3">트위터X</Dropdown.Item>
                  <Dropdown.Item eventKey="4">페이스북</Dropdown.Item>
                  <Dropdown.Item eventKey="5">링크</Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </Col>
            <Col className={classes.wishList}>
              <InterestButton funding={funding} setInterest={setInterest} />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <div dangerouslySetInnerHTML={{ __html: funding.content }}></div>
        </Col>
        <Col sm={4}>
          <Row className={classes.rewardList}>
            <SelectablRewardList
              rewards={funding.rewards}
              selectedReward={selectedReward}
              onChange={(v) => setSelectedReward(v)}
              disabled={!!funding.participated_reward_id}
            />
          </Row>

          <Row className={classes.joinBtn}>
            {funding.participated_reward_id
              // TODO(vi117): 환불 창 추가
              ? (
                <Button variant="danger" onClick={withdrawFunding}>
                  취소
                </Button>
              )
              : (
                <NavLink
                  to={`/fundings/${id}/pay/`}
                  state={{ funding: funding, selectedReward: selectedReward }}
                >
                  <Button
                    variant="success"
                    disabled={!selectedReward}
                  >
                    참가
                  </Button>
                </NavLink>
              )}
          </Row>
        </Col>
      </Row>

      <Container>
        <Row md={3} xs={1}>
          {fundings.map((x) => (
            <div key={x.id}>
              <NavLink to={`/fundings/${x.id}`}>
                <img
                  src={x.thumbnail}
                  style={{ width: "100%" }}
                  alt="썸네일 이미지"
                />
                <div>{x.tag}</div>
                <h3>{x.title}</h3>
                <div style={{ "overflow": "ellipsis" }}>{x.content}</div>
                <h3>달성도:{(x.current_value / x.target_value) * 100}%</h3>
              </NavLink>
            </div>
          ))}
        </Row>
      </Container>
    </Container>
  );

  async function setInterest(id, like = true) {
    const url = new URL(
      `/api/v1/fundings/${id}/interest`,
      window.location.origin,
    );
    url.searchParams.append("disset", !like);
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 401) {
      return "Unauthorized";
    } else if (res.status === 409) {
      return "Conflict";
    } else {
      mutate({
        ...funding,
        interest_user_id: like ? funding.host_id : null,
      });
    }
  }
  async function withdrawFunding() {
    if (!selectedReward) {
      throw new Error("not selected reward");
    }
    const url = new URL(
      `/api/v1/fundings/${id}/rewards/${selectedReward.id}/withdraw`,
      window.location.origin,
    );
    const res = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("withdraw error");
    }
    mutate({
      ...funding,
      participated_reward_id: null,
    });
    setSelectedReward(null);
  }
};

function InterestButton({ funding, setInterest }) {
  return (
    <>
      {funding.interest_user_id
        ? (
          <Button
            variant="outline-dark"
            onClick={() => {
              setInterest(funding.id, false);
            }}
          >
            관심취소⭐
          </Button>
        )
        : (
          <Button
            variant="outline-dark"
            onClick={() => {
              setInterest(funding.id);
            }}
          >
            관심설정⭐
          </Button>
        )}
    </>
  );
}
function SelectablRewardList(
  { rewards, selectedReward, onChange = () => {}, disabled = false },
) {
  return (
    <ListGroup>
      {rewards.map((reward) => (
        <ListGroup.Item
          action
          variant="success"
          key={reward.id}
          onClick={() => {
            if (!disabled) {
              onChange(reward);
            }
          }}
          active={selectedReward?.id === reward.id}
        >
          <h3>{reward.title}</h3>
          {reward.content}
          {reward.price} 원 총 {reward.reward_count} 개 현재{" "}
          {reward.reward_current_count} 개
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default FundingsDetail;
