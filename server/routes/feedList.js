import React, { useState } from "react";
import { Container, Typography, Card, CardContent, Divider } from "@mui/material";

function App() {
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      userId: "hong123",
      content: "오늘은 날씨가 참 좋네요!",
      cdatetime: "2025-04-29T09:30:00",
    },
    {
      id: 2,
      userId: "kim456",
      content: "React 연습 중입니다 ",
      cdatetime: "2025-04-29T10:00:00",
    },
  ]);
   return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>피드 목록</Typography>
      <Divider sx={{ mb: 2 }} />
      {feeds.map(feed => (
        <Card key={feed.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{feed.userId}</Typography>
            <Typography variant="body1">{feed.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(feed.cdatetime).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  )
}

export default App