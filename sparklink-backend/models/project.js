const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProjectStatus = require('./proj_status');
const User = require('./user'); // ✅ Import User model

const Project = sequelize.define('Project', {
  proj_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  product: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  // skills_req: {
  //   type: DataTypes.STRING(250),
  //   allowNull: true,
  // },
  budget: {
    type: DataTypes.DECIMAL(10, 2), // ✅ Fixed NUMERIC issue
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProjectStatus, // ✅ Use Sequelize model reference instead of raw table name
      key: 'status_id',
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  // start_date: {
  //   type: DataTypes.DATE,
  //   allowNull: true,
  //   defaultValue: null, // ✅ Ensure null default is valid in MySQL
  // },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // ✅ Ensures MySQL default date behavior
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // ✅ Use Sequelize model reference instead of raw table name
      key: 'user_id',
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'Y',
    validate: {
      isIn: [['Y', 'N']]
    }
  },
  category: {
  type: DataTypes.STRING(250),  // Ensure it matches frontend input type
  allowNull: true,  // Should be able to store NULL if needed
},
num_students: {
  type: DataTypes.INTEGER,
  allowNull: true, // Allow NULL for "N/A"
  defaultValue: null,
},
skills_required: {
  type: DataTypes.STRING(500),
  allowNull: true, // Allow empty values
  defaultValue: null,
},
skills_req: {
    type: DataTypes.STRING(250),
    allowNull: true,
  }
}, {
  tableName: 't_project',
  timestamps: false,
  charset: "utf8mb4", // ✅ Ensures proper text encoding in MySQL
  collate: "utf8mb4_unicode_ci"
});

// 🟢 Define Associations
Project.belongsTo(ProjectStatus, {
  foreignKey: 'status', // Matches the `status` field in Project model
  targetKey: 'status_id', // Matches the `status_id` field in ProjectStatus model
});

Project.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: "user"
});

module.exports = Project;
