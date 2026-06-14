import gql from 'graphql-tag';

export const LESSONS_QUERY = gql`
  query Lessons {
    lessons {
      id
      slug
      title
      description
      difficulty
      isOfficial
      visibility
      authorName
      isCommunity
    }
  }
`;

export const LESSON_QUERY = gql`
  query Lesson($id: ID!) {
    lesson(id: $id) {
      id
      slug
      title
      description
      lessonContent
      difficulty
      questions {
        id
        prompt
        options
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      imageUrl
      totalScore
    }
  }
`;

export const PROGRESS_QUERY = gql`
  query Progress {
    progress {
      lessonId
      score
      totalPossible
    }
  }
`;

export const SUBMIT_ATTEMPT = gql`
  mutation SubmitAttempt($lessonId: ID!, $answers: [Int!]!) {
    submitAttempt(lessonId: $lessonId, answers: $answers) {
      attemptId
      score
      totalPossible
      feedback {
        questionId
        correct
        points
        explanation
      }
    }
  }
`;

export const CREATE_LESSON = gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      slug
      title
    }
  }
`;
