import React from "react";
import { Grid, Card, Text, Group, Badge, Container } from "@mantine/core";

interface ClassInfo {
  name: string;
  date: string;
  place: string;
  spotsLeft: number;
}

const sampleClasses: ClassInfo[] = [
  {
    name: "Morning Yoga",
    date: "2024-03-20 08:00",
    place: "Studio A",
    spotsLeft: 5,
  },
  {
    name: "Evening Pilates",
    date: "2024-03-20 17:30",
    place: "Studio B",
    spotsLeft: 3,
  },
  {
    name: "HIIT Training",
    date: "2024-03-21 12:00",
    place: "Main Hall",
    spotsLeft: 8,
  },
];

export function ClubCard({ children }: { children?: React.ReactNode }) {
  return (
    <Container size="lg">
      <Card padding="lg" radius="md" withBorder>
        {children} {/* This will render any existing content */}
        <Text size="xl" fw={700} mt="xl" mb="md">
          Available Classes
        </Text>
        <Grid gutter="md">
          {sampleClasses.map((classInfo, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={600} size="lg">
                  {classInfo.name}
                </Text>

                <Group mt="md">
                  <Text size="sm" c="dimmed">
                    📅 {new Date(classInfo.date).toLocaleString()}
                  </Text>
                  <Text size="sm" c="dimmed">
                    📍 {classInfo.place}
                  </Text>
                </Group>

                <Badge
                  color={
                    classInfo.spotsLeft > 5
                      ? "green"
                      : classInfo.spotsLeft > 2
                        ? "yellow"
                        : "red"
                  }
                  mt="md"
                >
                  {classInfo.spotsLeft} spots left
                </Badge>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
    </Container>
  );
}
