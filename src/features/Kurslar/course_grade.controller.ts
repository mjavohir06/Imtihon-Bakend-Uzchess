import { Router } from "express";
import { User } from "../../entities/user.entity.js";
import { Kurslar } from "../../entities/course.entity.js";
import { CourseGrade } from "../../entities/course_grade.entity.js";


const CourseGradeRouter = Router();

CourseGradeRouter.get("/course-grade/:courseId/:userId", async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId, 10); 
        const userId = parseInt(req.params.userId, 10);
        const grades = await CourseGrade.find({
            where: { courseId ,userId},
            relations: ["user"]
        });
        if (grades.length === 0) {
            return res.status(404).json({ message: "No grades found for this course" });
        }
        res.status(200).json({ data: grades });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }   
});

CourseGradeRouter.post("/course-grade", async (req, res) => {
    try {
        const { star, comment, courseId, userId } = req.body;   
        if (star < 1 || star > 5) {
            return res.status(400).json({ message: "Star rating must be between 1 and 5" });
        }

        const user=await User.findOneBy({id:userId});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const course=await Kurslar.findOneBy({id:courseId});
        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }

        const courseGrade = CourseGrade.create({ star, comment, courseId, userId });
        await courseGrade.save();

        res.status(201).json({ message: "Course grade created", data: { star, comment, courseId, userId } });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }   
});




















export { CourseGradeRouter };