import { Request, Response } from "express";
import * as UserService from "./users.service"

export async function createUser(req: Request, res: Response) {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    } catch (err: any) {
        res.status(400).json({
            message: err.message,
        });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const user = await UserService.updateUser({
            id: Number(req.params.id),
            ...req.body,
        });

        res.json(user);
    } catch (err: any) {
        res.status(400).json({
            message: err.message,
        });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        await UserService.deleteUser(Number(req.params.id));

        res.json({
            message: "User deleted successfully",
        });
    } catch (err: any) {
        res.status(400).json({
            message: err.message,
        });
    }
}

export async function listUsers(req: Request, res: Response) {
    try {
        const users = await UserService.listUsers({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search as string,
        });

        res.json(users);
    } catch (err: any) {
        res.status(400).json({
            message: err.message,
        });
    }
}