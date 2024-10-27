class AddFieldsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :name, :string
    add_column :users, :surname, :string
    add_column :users, :active, :boolean
    add_column :users, :roletype, :int
    add_column :users, :domain, :integer
  end
end
