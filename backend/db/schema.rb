# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_22_223024) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accesses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "door_id", null: false
    t.string "type_access"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["door_id"], name: "index_accesses_on_door_id"
    t.index ["user_id"], name: "index_accesses_on_user_id"
  end

  create_table "doors", force: :cascade do |t|
    t.string "identification"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "domain"
  end

  create_table "keys", force: :cascade do |t|
    t.string "code"
    t.string "description"
    t.bigint "user_id"
    t.bigint "door_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["door_id"], name: "index_keys_on_door_id"
    t.index ["user_id"], name: "index_keys_on_user_id"
  end

  create_table "permissions", force: :cascade do |t|
    t.bigint "key_id", null: false
    t.integer "day_of_week"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["key_id"], name: "index_permissions_on_key_id"
  end

  create_table "remote_opening_requests", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "door_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["door_id"], name: "index_remote_opening_requests_on_door_id"
    t.index ["user_id"], name: "index_remote_opening_requests_on_user_id"
  end

  create_table "schedules", force: :cascade do |t|
    t.datetime "entry"
    t.datetime "exit"
    t.bigint "permission_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["permission_id"], name: "index_schedules_on_permission_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: ""
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "jti", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "cpf"
    t.string "username"
    t.string "name"
    t.string "surname"
    t.boolean "active"
    t.integer "roletype"
    t.integer "domain"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "accesses", "doors"
  add_foreign_key "accesses", "users"
  add_foreign_key "keys", "doors"
  add_foreign_key "keys", "users"
  add_foreign_key "permissions", "keys"
  add_foreign_key "remote_opening_requests", "doors"
  add_foreign_key "remote_opening_requests", "users"
  add_foreign_key "schedules", "permissions"
end
