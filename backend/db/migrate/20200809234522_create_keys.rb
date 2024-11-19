class CreateKeys < ActiveRecord::Migration[6.0]
  def change
    create_table :keys do |t|
      t.string :code
      t.string :description
      t.references :user, null: true, foreign_key: true
      t.references :door, null: true, foreign_key: true

      t.timestamps
    end
  end
end
