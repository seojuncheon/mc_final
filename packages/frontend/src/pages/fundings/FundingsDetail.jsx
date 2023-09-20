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
import useSWR from "swr";
import { useLogin } from "../../hook/useLogin";
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
    id: 4,
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
    content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
];

// const rewards = [
//   {
//     id: 1,
//     funding_id: 1,
//     title: "funding 1",
//     content: "펀딩 1 설명",
//     price: 10000,
//     reward_current_count: 1,
//     reward_count: 999,
//   },
//   {
//     id: 1,
//     funding_id: 2,
//     title: "funding 2",
//     content: "펀딩 2 설명",
//     price: 20000,
//     reward_current_count: 1,
//     reward_count: 999,
//   },
//   {
//     id: 1,
//     funding_id: 3,
//     title: "funding 3",
//     content: "펀딩 3 설명",
//     price: 10000,
//     reward_current_count: 1,
//     reward_count: 999,
//   },
//   {
//     id: 1,
//     funding_id: 4,
//     title: "funding 1",
//     content: "펀딩 1 설명",
//     price: 10000,
//     reward_current_count: 1,
//     reward_count: 999,
//   },
//   {
//     id: 1,
//     funding_id: 5,
//     title: "funding 1",
//     content: "펀딩 1 설명",
//     price: 10000,
//     reward_current_count: 1,
//     reward_count: 999,
//   },
// ];

const FundingsDetail = function() {
  const { id } = useParams();
  const { data: funding, error, isLoading } = useSWR(
    `/api/v1/fundings/${id}`,
    (url) => fetch(url).then((res) => res.json()),
  );
  const user_id = useLogin();

  if (isLoading) {
    // TODO(vi117): sippner 대신 Bootstrap.Placeholder 띄우기.
    return <Spinner />;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <Container style={{ "padding-top": "20px", "width": "50vw" }}>
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
          {funding.tags.map((tag) => <Badge>{tag.tag}</Badge>)}
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <Carousel slide={false}>
            <Carousel.Item>
              <img src={placeholder} text="First slide" />
              <Carousel.Caption>
                <h3>썸네일 Carousel or 사진한장</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={placeholder} text="Second slide" />
              <Carousel.Caption>
                <h3>썸네일 Carousel or 사진한장</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={placeholder} text="Third slide" />
              <Carousel.Caption>
                <h3>Third slide label</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col sm={4}>
          <Row style={{ margin: "16px" }}>
            {/* TODO(vi117): 예쁘게 날짜 출력 */}
            <div>
              {funding.begin_date.toString()} ~ {funding.end_date.toString()}
            </div>개설기간, 달성도(후원자 명수)
          </Row>

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
              {
                /* <Button variant="light">인</Button>
                <Button variant="light">트</Button>
                <Button variant="light">페</Button>
                <Button variant="light">링</Button> */
              }
            </Col>
            <Col className={classes.wishList}>
              {funding.interest_user_id
                ? <Button variant="outline-dark">관심취소⭐</Button>
                : <Button variant="outline-dark">관심설정⭐</Button>}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          {funding.content}
        </Col>
        <Col sm={4}>
          <Row className={classes.rewardList}>
            <ListGroup>
              {funding.rewards.map((reward) => (
                <ListGroup.Item action variant="success">
                  <h3>{reward.title}</h3>
                  {reward.content}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Row>

          <Row className={classes.joinBtn}>
            {funding.participated_reward_id
              ? <Button variant="danger">취소</Button>
              : <Button variant="success">참가</Button>}
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
};

export default FundingsDetail;
