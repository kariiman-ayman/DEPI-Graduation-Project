import type { Request, Response } from "express";

import type { CreateDepartmentDTO } from "../../types/department.types.js";

import {
  createDepartment,
  getDepartments,
  deleteDepartment,
} from "../../services/department.service.js";

export const createDepartmentController = async (
  req: Request<{}, {}, CreateDepartmentDTO>,
  res: Response,
) => {
  try {
    const department = await createDepartment(req.body);

    res.status(201).json({
      message: "Department created successfully",

      department,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getDepartmentsController = async (req: Request, res: Response) => {
  try {
    const departments = await getDepartments();

    res.json(departments);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteDepartmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const result = await deleteDepartment(id as string);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};
