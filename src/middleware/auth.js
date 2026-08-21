import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    let decoded;
    let token = accessToken;

    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, config.jwt.secret);
      } catch (err) {
        if (err.name === 'TokenExpiredError' && refreshToken) {
          try {
            decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
            token = refreshToken;
          } catch (refreshErr) {
            return res.status(401).json({
              success: false,
              message: 'Session expired. Please log in again.'
            });
          }
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid token. Please log in again.'
          });
        }
      }
    } else if (refreshToken) {
      try {
        decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
        token = refreshToken;
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.'
        });
      }
    }

    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact support.'
      });
    }

    if (token === refreshToken && user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Token mismatch. Please log in again.'
      });
    }

    req.user = user;
    req.token = token;
    req.isRefreshToken = token === refreshToken;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error. Please try again.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    
    if (!accessToken) {
      return next();
    }

    const decoded = jwt.verify(accessToken, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    next();
  }
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = config.nodeEnv === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

export const clearTokenCookies = (res) => {
  const isProduction = config.nodeEnv === 'production';
  
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });
};