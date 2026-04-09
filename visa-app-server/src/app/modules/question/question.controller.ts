import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { QuestionServices } from './question.service';

// ─── Create ────────────────────────────────────────────────────────────────────

const createQuestion = catchAsync(async (req: Request, res: Response) => {
    const result = await QuestionServices.createQuestionIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Question created successfully',
        data: result,
    });
});

// ─── Get All ───────────────────────────────────────────────────────────────────

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
    const result = await QuestionServices.getAllQuestionsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Questions retrieved successfully',
        data: result,
    });
});

// ─── Get Steps Config ──────────────────────────────────────────────────────────

const getStepsConfig = catchAsync(async (req: Request, res: Response) => {
    const { visaTypeId } = req.params;
    const result = await QuestionServices.getStepsConfigForVisaType(visaTypeId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Steps config retrieved successfully',
        data: result,
    });
});

// ─── Get Single ────────────────────────────────────────────────────────────────

const getSingleQuestion = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await QuestionServices.getSingleQuestionFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question retrieved successfully',
        data: result,
    });
});

// ─── Update ────────────────────────────────────────────────────────────────────

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await QuestionServices.updateQuestionIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question updated successfully',
        data: result,
    });
});

// ─── Delete ────────────────────────────────────────────────────────────────────

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await QuestionServices.deleteQuestionFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question deleted successfully',
        data: result,
    });
});

// ─── Bulk Reorder ──────────────────────────────────────────────────────────────

const reorderQuestions = catchAsync(async (req: Request, res: Response) => {
    // body: { items: [{ id: string; sortOrder: number }] }
    const { items } = req.body;
    const result = await QuestionServices.reorderQuestionsIntoDB(items);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Questions reordered successfully',
        data: result,
    });
});

export const QuestionControllers = {
    createQuestion,
    getAllQuestions,
    getStepsConfig,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
};
