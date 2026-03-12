const express = require('express');
const router = express.Router();
const roleModel = require('../schemas/roles');
const userModel = require('../schemas/users');

// ==================== ROLE CRUD ====================

// 1. GET all roles
router.get('/', async (req, res) => {
    try {
        const roles = await roleModel.find({});
        res.json({
            status: 200,
            message: 'Lấy danh sách roles thành công',
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi lấy danh sách roles',
            error: error.message
        });
    }
});

// 2. GET role by id
router.get('/:id', async (req, res) => {
    try {
        const role = await roleModel.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy role'
            });
        }
        res.json({
            status: 200,
            message: 'Lấy role thành công',
            data: role
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi lấy role',
            error: error.message
        });
    }
});

// 3. CREATE role
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                status: 400,
                message: 'name là bắt buộc'
            });
        }

        const newRole = await roleModel.create({
            name,
            description: description || ""
        });

        res.status(201).json({
            status: 201,
            message: 'Tạo role thành công',
            data: newRole
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi tạo role',
            error: error.message
        });
    }
});

// 4. UPDATE role
router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const role = await roleModel.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy role'
            });
        }

        const updatedRole = await roleModel.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        res.json({
            status: 200,
            message: 'Cập nhật role thành công',
            data: updatedRole
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi cập nhật role',
            error: error.message
        });
    }
});

// 5. DELETE role (xoá cứng)
router.delete('/:id', async (req, res) => {
    try {
        const role = await roleModel.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy role'
            });
        }

        await roleModel.findByIdAndDelete(req.params.id);

        res.json({
            status: 200,
            message: 'Xoá role thành công'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi xoá role',
            error: error.message
        });
    }
});


// 6. GET all users với role cụ thể
router.get('/:id/users', async (req, res) => {
    try {
        const role = await roleModel.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy role'
            });
        }

        const users = await userModel.find({ role: req.params.id }).populate('role');

        res.json({
            status: 200,
            message: `Lấy danh sách users của role "${role.name}" thành công`,
            data: {
                role: role,
                users: users,
                count: users.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi lấy danh sách users của role',
            error: error.message
        });
    }
});

module.exports = router;
