const express = require('express');
const router = express.Router();
const userModel = require('../schemas/users');

// ==================== USER CRUD ====================

// 1. GET all users
router.get('/', async (req, res) => {
    try {
        const users = await userModel.find({}).populate('role');
        res.json({
            status: 200,
            message: 'Lấy danh sách users thành công',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi lấy danh sách users',
            error: error.message
        });
    }
});

// 2. GET user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).populate('role');
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy user'
            });
        }
        res.json({
            status: 200,
            message: 'Lấy user thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi lấy user',
            error: error.message
        });
    }
});

// 3. CREATE user
router.post('/', async (req, res) => {
    try {
        const { username, password, email, fullName, role } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({
                status: 400,
                message: 'username, password, email là bắt buộc'
            });
        }

        const newUser = await userModel.create({
            username,
            password,
            email,
            fullName: fullName || "",
            role: role || null,
            status: false,
            loginCount: 0
        });

        await newUser.populate('role');

        res.status(201).json({
            status: 201,
            message: 'Tạo user thành công',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi tạo user',
            error: error.message
        });
    }
});

// 4. UPDATE user
router.put('/:id', async (req, res) => {
    try {
        const { username, password, email, fullName, role, loginCount } = req.body;
        
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy user'
            });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = password;
        if (email) updateData.email = email;
        if (fullName) updateData.fullName = fullName;
        if (role) updateData.role = role;
        if (loginCount !== undefined) updateData.loginCount = loginCount;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('role');

        res.json({
            status: 200,
            message: 'Cập nhật user thành công',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi cập nhật user',
            error: error.message
        });
    }
});

// 5. DELETE user (xoá mềm - set status = false)
router.delete('/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy user'
            });
        }

        // Xoá mềm: set status = false
        const deletedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { status: false },
            { new: true }
        ).populate('role');

        res.json({
            status: 200,
            message: 'Xoá user thành công',
            data: deletedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi xoá user',
            error: error.message
        });
    }
});

// 6. POST /enable - Enable user (set status = true)
router.post('/enable', async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                status: 400,
                message: 'username và email là bắt buộc'
            });
        }

        const user = await userModel.findOne({
            username: username,
            email: email
        }).populate('role');

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy user với username và email này'
            });
        }

        const enabledUser = await userModel.findByIdAndUpdate(
            user._id,
            { status: true },
            { new: true }
        ).populate('role');

        res.json({
            status: 200,
            message: 'Enable user thành công',
            data: enabledUser
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi enable user',
            error: error.message
        });
    }
});

// 7. POST /disable - Disable user (set status = false)
router.post('/disable', async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                status: 400,
                message: 'username và email là bắt buộc'
            });
        }

        const user = await userModel.findOne({
            username: username,
            email: email
        }).populate('role');

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy user với username và email này'
            });
        }

        const disabledUser = await userModel.findByIdAndUpdate(
            user._id,
            { status: false },
            { new: true }
        ).populate('role');

        res.json({
            status: 200,
            message: 'Disable user thành công',
            data: disabledUser
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi khi disable user',
            error: error.message
        });
    }
});

module.exports = router;
