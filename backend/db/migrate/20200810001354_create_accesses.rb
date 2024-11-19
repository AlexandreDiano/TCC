class CreateAccesses < ActiveRecord::Migration[6.0]
  def change
    create_table :accesses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :door, null: false, foreign_key: true
      t.string :type_access

      t.timestamps
    end
  end
end
