# 8 Queens Puzzle Solver

## Original Hebrew Explanation

הסבר על הפרויקט
- פתרון בעיית 8 המלכות
פרויקט זה עוסק בפתרון בעיית 8 המלכות על לוח שחמט בגודל 8 על 8. המטרה היא למקם 8 מלכות על הלוח
כך שאף מלכה לא מאיימת על מלכה אחרת, כלומר, אין שתי מלכות באותה שורה, עמודה או אלכסון.
הפרויקט משתמש בתכנות מונחה עצמים (OOD) ובממשק גרפי (GUI) כדי להציג את הלוח, למקם את המלכות,
ולהדגיש את הפתרונות האפשריים.
יש לשמור את התיקיה ממן 13 לתוך C:\ כדי שהפרויקט יוכל לגשת לקבצים הרלוונטים לבניית המלכות והלוח.
C:\Maman13

כיצד להפעיל את הפרויקט
1.פתח חלון Workspace:
2.צור מופע של הפותר והפעל את המשחק
בחלון ה-Workspace, הדבק את הקוד הבא:
| queenSolver |
queenSolver := QueenSolver new.
queenSolver start.

כיצד לעצור את התוכנית:
השתמש בקיצור המקלדת Alt + :.

חסימת משבצות:
כדי לחסום משבצת מסוימת על הלוח (למנוע ממלכה להיכנס אליה), לחץ לחיצה ימנית על המשבצת.
המשבצת תסומן בצבע אדום, המציין שהיא חסומה.
לחיצה נוספת על המשבצת תוריד את החסימה של המשבצת.

## English Translation

### Project Explanation
- Solving the 8 Queens Problem
This project deals with solving the 8 Queens problem on an 8x8 chessboard. The goal is to place 8 queens on the board
such that no queen threatens another queen, meaning there are no two queens in the same row, column, or diagonal.
The project uses Object-Oriented Design (OOD) and a Graphical User Interface (GUI) to display the board, place the queens,
and highlight possible solutions.
Save the Maman13 folder to C:\ so that the project can access the relevant files for constructing the queens and board.
C:\Maman13

### How to Run the Project
1. Open a Workspace window
2. Create an instance of the solver and run the game
In the Workspace window, paste the following code:
```smalltalk
| queenSolver |
queenSolver := QueenSolver new.
queenSolver start.
```

### How to Stop the Program:
Use the keyboard shortcut Alt + .

### Blocking Squares:
To block a specific square on the board (prevent a queen from entering it), right-click on the square.
The square will be marked in red, indicating it is blocked.
Another click on the square will remove the blocking of the square. 