import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
    static userRegistration = async (req, res) => {
        const { username, email, password, first_name, last_name } = req.body;

        try {
            const emailExist = { key: 'email', value: email };
            const user = await userModel.findOne(emailExist);
            
            if (user) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Email already exists',
                    result: null
                });
            }

            if (username && email && password && first_name && last_name) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);

                const newUser = new userModel({
                    'username': username,
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'password': hashPassword,
                });

                await newUser.save();
                const savedUser = await userModel.findOne(emailExist);
                // Generate token
                const token = jwt.sign({ userID: savedUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

                return res.status(200).json({
                    status: 'success',
                    message: 'Successfully registered.',
                    token: token
                });
                
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'All fields are required.',
                    result: null
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'failed',
                message: 'Unable to register.',
                result: null
            });
        }
    }

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (email && password) {
                const emailExist = { key: 'email', value: email };
                const user = await userModel.findOne(emailExist);
                
                if (user) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    return res.send(isMatch);
                    if (isMatch) {
                        // Generate token
                        const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

                        return res.status(200).json({
                            status: 'success',
                            message: 'Login success.',
                            token: token
                        });
                    } else {
                        return res.status(401).json({
                            status: 'failed',
                            message: 'Email Or password is wrong.',
                            result: null
                        });
                    }
                } else {
                    return res.status(401).json({
                        status: 'failed',
                        message: 'You are not a registered user.',
                        result: null
                    });
                }
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Email and password are required.',
                    result: null
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'failed',
                message: 'Unable to login.',
                result: null
            });
        }
    }

    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body;

        try {
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Passwords do not match.',
                        result: null
                    });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassword = await bcrypt.hash(password, salt);

                    // Update user's password in the database (replace 'userId' with the actual user identifier)
                    // Example: await userModel.updateOne({ _id: userId }, { password: newHashPassword });

                    return res.status(200).json({
                        status: 'success',
                        message: 'Password successfully changed.',
                        result: null
                    });
                }
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'All fields are required.',
                    result: null
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'failed',
                message: 'Unable to change password.',
                result: null
            });
        }
    }
}

export default UserController;
